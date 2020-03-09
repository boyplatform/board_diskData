'use strict'
require('date-utils');
var conf=require("../../../src/config");
var diskDataCommon=require('../../../src/boyDiskDataCommon.js');
var InodeCahce=require("../../../coreLibs/iNodeCache");
var RequestLog=require("../../../pojo/RequestLog");
var DiskDataNodeInfoRecord=require("../../../Dao/DiskDataNodeInfoRecord");
var DataOperator=require("../../../DataOperator/DataOperator");
var OperationLog=require("../../../pojo/operationLog");
const DiskDataHttpHelper=require('../../../src/boyDiskDataHttpHelper');

function DecideAndAction(){
    
   
    if(conf.redisPoolConfig!==undefined&&conf.redisClusterPoolConfig!==undefined)
    {
        if(conf.platformArch.redisMode==="cluster"){
            this.memoryNodeCache=new InodeCahce("redisCluster");
            this.memoryNodeCache.setConn(conf.redisClusterPoolConfig);
        }else{
            this.memoryNodeCache=new InodeCahce("redis");
            this.memoryNodeCache.setConn(conf.redisPoolConfig);
        }
        this.interact=undefined;
        this.dataOperaBlockCheckDecideAndAction=undefined;

        this.diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
        this.nodeRoleRs=undefined;
         
    }else{
        console.log("Please finish your redis config");
    }
}

DecideAndAction.prototype.constructor=DecideAndAction;

//(0)sub the remote input write operation and save it to local nodeDB req table
DecideAndAction.prototype.getWriteOperationMessageStart=function(targetDbName,appId,appName,appGuid,reqStorageClusterType){
      

    if(conf.redisPoolConfig!==undefined&&conf.redisClusterPoolConfig!==undefined&&this.memoryNodeCache!==undefined)
    {

        //verify whether it's non-blockchain operation
        if(targetDbName===conf.platformArch.NonBlockChainSubscribeChannel.toUpperCase()+conf.platformArch.serviceFor.reqStorageClusterType.toString()){

                this.memoryNodeCache.getSubscribeData(targetDbName,function(message){

                    console.log("this.nodeRoleRs",this.nodeRoleRs);
                    var writeSqlSha=diskDataCommon.getSha256(reqStorageClusterType.toString()+targetDbName+message,conf.platformArch.shaHashLengh);
                    let dataOperator=new DataOperator();
                        dataOperator.executeWrite(message,function(result){
                                
                            if(result!=false){
                                
                                //add-in log into operationLog
                                var operationLog=new OperationLog(reqStorageClusterType,diskDataCommon.getUUID(),null,null,null,diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),conf.platformArch.serviceFor.appId,null,null,null,null,null,null,null,null,null,4,null,
                                conf.platformArch.serviceFor.appGuid,null,writeSqlSha,message);
                                this.diskDataNodeInfoRecord.operationLogInsert(operationLog);
                            } 
                        }.bind(this),reqStorageClusterType);
                }.bind(this));

        }else{
                this.memoryNodeCache.getSubscribeData(targetDbName,function(message){

                    //change message into sha
                    var writeSqlSha=diskDataCommon.getSha256(reqStorageClusterType.toString()+targetDbName+message,conf.platformArch.shaHashLengh);
                    var userId=0,url='',userGuid='';
                    //save sha message and message and other info into local nodeDB of requestLog
                    var requestLog=undefined;
                    //verify whether current node is master,if it is, then update isConfirmedByMaster=true directly.
                    console.log("this.nodeRoleRs",this.nodeRoleRs);
                    if(this.nodeRoleRs==="m"){
                        requestLog=new RequestLog(appId,appName,appGuid,userId,url,diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),reqStorageClusterType,diskDataCommon.getUUID(),true,userGuid,writeSqlSha,message,true,false,null,targetDbName);
                    }else{
                        requestLog=new RequestLog(appId,appName,appGuid,userId,url,diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),reqStorageClusterType,diskDataCommon.getUUID(),true,userGuid,writeSqlSha,message,false,false,null,targetDbName);
                    }
                
                    if(requestLog!==undefined){
                        this.diskDataNodeInfoRecord.RequestLogInsert(requestLog);
                    }
                    
                }.bind(this));
        }
        
    }
}

//(2.2)crystal cluster operation talking crystalTalkingMasterConfirmReqProcessing  at master
DecideAndAction.prototype.crystalTalkingMasterConfirmReqProcessing=function()
{
    console.log("crystalTalkingMasterConfirmReqProcessing started");
    //console.log("receivedTalkingMessage:",this.interact.receivedTalkingMessage);
      if(conf.redisPoolConfig===undefined||conf.redisClusterPoolConfig===undefined||this.interact.receivedTalkingMessage===undefined)
      {
           console.log("conf.redisPoolConfig or conf.redisClusterPoolConfig or receivedTalkingMessage was not init before crystalTalkingMasterConfirmReqProcessing.")
           return;
      }

   
      let  receivedTalkingMessageCube=this.interact.receivedTalkingMessage;
      //console.log("receivedTalkingMessageCube:",receivedTalkingMessageCube);
      for(var key in receivedTalkingMessageCube)
      {

            let currentOperationVerificationCube=receivedTalkingMessageCube[key];
             
           
            //verify whether current cluster operation request was timeout as conf define and need enforce verification even the cube length is not enough.
            let whetherEnforceVerification=false;
            for(let item of currentOperationVerificationCube)
            {
                let now=new Date();
                let mandantoryVerifyTime=(item.createTime===null? null: (new Date(item.createTime)).clone()); 
                if(mandantoryVerifyTime!=null)
                {
                   mandantoryVerifyTime.addSeconds(conf.platformArch.masterMandantoryVerifyTimeOut);//Node Db没有queue index Memory中已有队列索引流量整形info时，使用平台强制执行秒数。
                } 
               
                if(now>mandantoryVerifyTime){
                    whetherEnforceVerification=true;
                    break;
                    
                }else{
                    whetherEnforceVerification=false;
                }
                //console.log("mandantoryVerifyTime:",mandantoryVerifyTime);
                //console.log("whetherEnforceVerification:",whetherEnforceVerification);
            }
            
             //verify whether receivedTalkingMessage's count is larger than/equal to crystal crystalTalkingSize
            if(currentOperationVerificationCube.length>=(conf.platformArch.crystalCluster.crystalTalkingSize)||whetherEnforceVerification===true){
                   
                    //if yes, verify whether the req operation sha is same with each other which comes from diff crystal cluster ip；whether sha is existed under master nodeDB also.
                    let lastWriteSha='';
                    let lastComeFromCrystalNodeIp="";
                    let whetherShaEqualWithEachOther=true;
                    let whetherShaExistedUnderMasterNodeDbAlso=true;
                    for(let item of currentOperationVerificationCube){

                        if(lastComeFromCrystalNodeIp!==item.comeFromCrystalNodeIp)
                        {
                            if(lastWriteSha===''){
                                lastWriteSha=item.writeSqlSha;
                            }else{
                                if(lastWriteSha!==item.writeSqlSha){
                                    whetherShaEqualWithEachOther=false;
                                    break;
                                }
                                lastWriteSha=item.writeSqlSha;
                            }
                        }

                    }
                    //console.log("whetherShaEqualWithEachOther:",whetherShaEqualWithEachOther);
                    //let lastConfirmedLocalReqGuid='';
                    //let lastSubNodeReqGuid='';
                    let belowLoopCount=0;
                    for(let item of currentOperationVerificationCube)
                    {
                        belowLoopCount++;
                        //whetherShaExistedUnderMasterNodeDbAlso check from master operationLog
                        this.diskDataNodeInfoRecord.operationLogSelect("1","where writeSqlSha=? and writeSql=?",[item.writeSqlSha,item.writeSql],"",function(rows){
                            
                            if(rows!==undefined&&rows.length<=0){
                                whetherShaExistedUnderMasterNodeDbAlso=false;
                               
                            }
                            //console.log("whetherShaExistedUnderMasterNodeDbAlso:",whetherShaExistedUnderMasterNodeDbAlso);   
                                             
                        }.bind(this));

                       
                       
                       
                        //console.log("item.isResendReqOrNot:",item.isResendReqOrNot);
                        //if not equal with eachother,send failed message to crystal cluster node via http
                       if(whetherShaEqualWithEachOther===false||(whetherShaExistedUnderMasterNodeDbAlso===false&&item.isResendReqOrNot===false)){
                                                                            
                                                var domainUrl=item.comeFromCrystalNodeIp+":"+item.replyToCrystalNodePort;
                                                            var partialUrl="/crystalTalkingReceiver";
                                                            var qs=""
                                                            var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                                            var body={
                                                                'type':'opMasterConfirmResult',
                                                                'reqGuid':item.reqGuid,
                                                                'isConfirmed':false
                                                            };
                                                            DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){
                                                                //then wait get confirmation&approve from master via another talking function
                                                                console.log(res);
                                                                if(belowLoopCount===currentOperationVerificationCube.length){
                                                                   delete receivedTalkingMessageCube[key];
                                                                }
                                                            });
                                                        
                                            
                                    }else{
                                        
                                            //if equal with eachother,send confirm message to crystal cluster node via http
                                            var domainUrl=item.comeFromCrystalNodeIp+":"+item.replyToCrystalNodePort;
                                                        var partialUrl="/crystalTalkingReceiver";
                                                        var qs=""
                                                        var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                                        var body={
                                                            'type':'opMasterConfirmResult',
                                                            'reqGuid':item.reqGuid,
                                                            'isConfirmed':true
                                                        };
                                                        DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){
                                                            //then wait get confirmation&approve from master via another talking function
                                                            console.log(res);
                                                            if(belowLoopCount===currentOperationVerificationCube.length){
                                                               delete receivedTalkingMessageCube[key];
                                                            }
                                                        });
                                                    
                                            
                                    }
                       
                                
                   }
                      
                    
            }

      }

}

module.exports=DecideAndAction;
