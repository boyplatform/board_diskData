'use strict'
require('date-utils');
var conf=require("../../../src/config");
var diskDataCommon=require('../../../src/boyDiskDataCommon.js');
var InodeCahce=require("../../../coreLibs/iNodeCache");
var RequestLog=require("../../../pojo/RequestLog");
var DataOperator=require("../../../DataOperator/DataOperator");
const DiskDataHttpHelper=require('../../../src/boyDiskDataHttpHelper');

var OperationLog=require("../../../pojo/operationLog");


var DiskDataNodeInfoRecord=require("../../../Dao/DiskDataNodeInfoRecord");
var CrystalClusterInfoRecord=require("../../../Dao/crystalClusterInfoRecord");


function DeamonThreads(){
    
   
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
        
         
    }else{
        console.log("Please finish your redis config");
    }
}

DeamonThreads.prototype.constructor=DeamonThreads;

//(1)crystal cluster operation talking sender
DeamonThreads.prototype.crystalTalkingSender= function(){
 
    console.log("crystalTalkingSender started");
    //send received write operaiton req to crystal master node
        //loop the reqLog and seek the current master node info out, send the req to master node for verification.
        this.diskDataNodeInfoRecord.RequestLogSelect((conf.platformArch.crystalCluster.crystalTalkingSize/(diskDataCommon.getCurrentCrystalClusterNodeCount()-1)).toFixed(0),"where isActive=1 and isSentToMaster=0",[""],"order by createTime", function(rows){
            if(rows!=undefined){
                for(let row of rows)
                {
                    var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                        crystalClusterInfoRecord.crystalClusterBlockSelect("1","where crstalNodeRole=0",[""],"", function(rows2){
                              if(rows2!==undefined&&rows2[0]!==undefined)
                              {
                                    let  currentMasterNodeIp=rows2[0].crystalNodeIp;
                                    let  currentMasterNodePort=rows2[0].crystalNodePort;
                                    if(currentMasterNodeIp.trim()!==diskDataCommon.getCurrentServerIpAdress().trim()
                                    ||currentMasterNodeIp.trim()==="127.0.0.1")
                                    {
                                        var domainUrl=currentMasterNodeIp+":"+currentMasterNodePort;
                                        var partialUrl="/crystalTalkingReceiver";
                                        var qs=""
                                        var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                        var body={
                                            'type':'opGetReqFromSubNode',
                                            'reqGuid':row.reqGuid,
                                            'appId':row.appId,
                                            'appName':row.appName,
                                            'appGuid':row.appGuid,
                                            'userId':row.userId,
                                            'url':row.url,
                                            'reqStorageClusterType':row.reqStorageClusterType,
                                            'isActive':row.isActive,
                                            'userGuid':row.userGuid,
                                            'writeSqlSha':row.writeSqlSha,
                                            'writeSql':row.writeSql,
                                            'isResendReqOrNot':false
                                        };
                                        DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){
                                                    //then wait get confirmation&approve from master via another talking function
                                                    //console.log(res);
                                                    if(res!=null&&res!=undefined&&res.result===true){
                                                        var diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
                                                        diskDataNodeInfoRecord.RequestLogIsSentToMasterUpdate(true,row.reqGuid);
                                                    }

                                        });
                                        
                                    }
                             }
                        });    
                }
             }
        });
   
        

}



//(3.1)crystal cluster operation master-confirmation&approve status checker on sub node 
DeamonThreads.prototype.crystalTalkingOperationConfirmChecker=function(){
    console.log("crystalTalkingOperationConfirmChecker started");
    //loop all the reqLog under current nodeDB which has been sent to master
    this.diskDataNodeInfoRecord.RequestLogSelect(conf.platformArch.crystalCluster.crystalTalkingSize,"where isActive=1 and isSentToMaster=1 and isConfirmedByMaster=0",[""],"order by createTime", function(rows){
       
         if(rows!==undefined){
                for(let row of rows){

                    let whetherResendVerification=false;
                    let now=new Date();
                        let mandantoryActionTime=(row.sendToMasterTime===null? null: new Date(row.sendToMasterTime).clone()); 
                        if(mandantoryActionTime!=null)
                        {
                            mandantoryActionTime.addSeconds(conf.platformArch.crystalCluster.crystalResendTimeout);//Node Db没有queue index Memory中已有队列索引流量整形info时，使用平台强制执行秒数。
                        } 
                    
                        if(now>mandantoryActionTime){
                            whetherResendVerification=true;
                            
                        } 

                        if(whetherResendVerification){

                            var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                            crystalClusterInfoRecord.crystalClusterBlockSelect("1","where crstalNodeRole=0",[""],"", function(rows2){
                                if(rows2!=undefined)
                                {
                                    let  currentMasterNodeIp=rows2[0].crystalNodeIp;
                                    let  currentMasterNodePort=rows2[0].crystalNodePort;
                                    if(currentMasterNodeIp.trim()!==diskDataCommon.getCurrentServerIpAdress().trim()
                                    ||currentMasterNodeIp.trim()==="127.0.0.1")
                                    {
                                        var domainUrl=currentMasterNodeIp+":"+currentMasterNodePort;
                                        var partialUrl="/crystalTalkingReceiver";
                                        var qs=""
                                        var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                        var body={
                                            'type':'opGetReqFromSubNode',
                                            'reqGuid':row.reqGuid,
                                            'appId':row.appId,
                                            'appName':row.appName,
                                            'appGuid':row.appGuid,
                                            'userId':row.userId,
                                            'url':row.url,
                                            'reqStorageClusterType':row.reqStorageClusterType,
                                            'isActive':row.isActive,
                                            'userGuid':row.userGuid,
                                            'writeSqlSha':row.writeSqlSha,
                                            'writeSql':row.writeSql,
                                            'isResendReqOrNot':true
                                        };
                                        DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){
                                                    //then wait get confirmation&approve from master via another talking function
                                                    console.log(res);
                                                    if(res!=null&&res!=undefined&&res.result===true){
                                                        var diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
                                                        diskDataNodeInfoRecord.RequestLogIsSentToMasterUpdate(true,row.reqGuid);
                                                    }

                                        });
                                        
                                    }
                            }
                        }.bind(this)); 


                        }

                }
        }

    }.bind(this))
   

}


//(4)crystal cluster confirmed operation execution
DeamonThreads.prototype.crystalTalkingOperationExecute=function(){

    if(this.dataOperaBlockCheckDecideAndAction!==undefined&&this.dataOperaBlockCheckDecideAndAction.wetherStopGeneralProcess===false)
    {
            console.log("crystalTalkingOperationExecute started");
            //Execute the active&confirmed request on local nodeDB and then set as not-active(then using a job to remove it timely)
            this.diskDataNodeInfoRecord.RequestLogSelect((conf.platformArch.crystalCluster.crystalTalkingSize/(diskDataCommon.getCurrentCrystalClusterNodeCount()-1)).toFixed(0),"where isActive=1 and isConfirmedByMaster=1",[""],"",function(rows){
                if(rows!=undefined)
                {
                    let dataOperator=new DataOperator();
                    for(let row of rows){
                        dataOperator.executeWrite(row.writeSql,function(result){
                            
                            if(result!=false){
                                
                                var requestLog=new RequestLog(null,null,null,null,null,null,null,row.reqGuid,false,null,null,null,null,null,null,null);
                                var diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
                                diskDataNodeInfoRecord.RequestLogIsActiveUpdate(requestLog);
                                //add-in log into operationLog
                                var operationLog=new OperationLog(row.reqStorageClusterType,diskDataCommon.getUUID(),null,null,null,diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),conf.platformArch.serviceFor.appId,null,null,null,null,null,null,null,null,null,4,null,
                                conf.platformArch.serviceFor.appGuid,null,row.writeSqlSha,row.writeSql);
                                diskDataNodeInfoRecord.operationLogInsert(operationLog);
                            } 
                        },row.reqStorageClusterType);
                    
                    }
                }
            });

    }
    
} 

//(5)remove not active requestLog under local nodeDB
DeamonThreads.prototype.crystalTalkingRemoveNonActiveRequest=function(){
    console.log("crystalTalkingRemoveNonActiveRequest started");
    this.diskDataNodeInfoRecord.RequestLogSelect("","where isActive=0",[""],"",function(rows){
           if(rows!=undefined){
                var diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
                for(let row of rows){
                    diskDataNodeInfoRecord.RequestLogDelete(row.reqId);
                }
            }
    });
}

module.exports=DeamonThreads;