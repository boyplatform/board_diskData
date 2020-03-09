'use strict'
require('date-utils');
var conf=require("../../../src/config");
var diskDataCommon=require('../../../src/boyDiskDataCommon.js');
var InodeCahce=require("../../../coreLibs/iNodeCache");
var RequestLog=require("../../../pojo/RequestLog");
var DataOperator=require("../../../DataOperator/DataOperator");
const DiskDataHttpHelper=require('../../../src/boyDiskDataHttpHelper');

var OperationLog=require("../../../pojo/operationLog");
var OperationLogLanding=require("../../../pojo/operationLogLanding");

var DiskDataNodeInfoRecord=require("../../../Dao/DiskDataNodeInfoRecord");
var CrystalClusterInfoRecord=require("../../../Dao/crystalClusterInfoRecord");

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
         this.diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
         this.wetherStopGeneralProcess=false;
         
          
     }else{
         console.log("Please finish your redis config");
     }
 }

 //(2.1)verify inputed summary sha cube,and return back result to sub node
 DecideAndAction.prototype.crystalTalkingMasterVerifyOperationSummarySha=function(){
        
    console.log("crystalTalkingMasterVerifyOperationSummarySha started");
        if(conf.redisPoolConfig===undefined||conf.redisClusterPoolConfig===undefined||this.interact.receivedTalkingMessage===undefined)
        {
            console.log("conf.redisPoolConfig or conf.redisClusterPoolConfig or receivedTalkingMessage was not init before crystalTalkingMasterVerifyOperationSummarySha.")
            return;
        }

    
        let  receivedTalkingMessageCube=this.interact.receivedTalkingMessage;
        for(var key in receivedTalkingMessageCube)
        {

            let currentOperationVerificationCube=receivedTalkingMessageCube[key];
            
            
            //verify whether current cluster operation request was timeout as conf define and need enforce verification even the cube length is not enough.
            let whetherEnforceVerification=false;
            for(let item of currentOperationVerificationCube)
            {
                let now=new Date();
                let mandantoryVerifyTime=(item.createTime===null? null: new Date(item.createTime).clone()); 
                if(mandantoryVerifyTime!=null)
                {
                    mandantoryVerifyTime.addSeconds(conf.platformArch.masterMandantoryVerifyTimeOut);//Node Db没有queue index Memory中已有队列索引流量整形info时，使用平台强制执行秒数。
                } 
                
                if(now>mandantoryVerifyTime){
                    whetherEnforceVerification=true;
                    
                }else{
                    whetherEnforceVerification=false;
                }
            }
        
            //verify whether receivedTalkingMessage's count is larger than/equal to crystal cluster node count-1
            if(currentOperationVerificationCube.length>=(diskDataCommon.getCurrentCrystalClusterNodeCount()-1)||whetherEnforceVerification===true){
                    
                    //if yes, verify whether the summary operation sha is same with each other which comes from diff crystal cluster ip；whether summary operation sha is existed under master nodeDB also.
                    let lastLatestCheckOperationSha='';
                    let lastComeFromCrystalNodeIp="";
                    let whetherShaEqualWithEachOther=true;
                    let whetherShaExistedUnderMasterNodeDbAlso=true;
                    for(let item of currentOperationVerificationCube){

                        if(lastComeFromCrystalNodeIp!==item.comeFromCrystalNodeIp)
                        {
                            if(lastLatestCheckOperationSha===''){
                                lastLatestCheckOperationSha=item.latestCheckOperationSha;
                            }else{
                                if(lastLatestCheckOperationSha!==item.latestCheckOperationSha){
                                    whetherShaEqualWithEachOther=false;
                                    break;
                                }
                                lastLatestCheckOperationSha=item.latestCheckOperationSha;
                            }
                        }

                    }
                    
                    //let lastConfirmedLocalReqGuid='';
                    //let lastSubNodeReqGuid='';
                    let belowLoopCount=0;
                    for(let item of currentOperationVerificationCube)
                    {
                        belowLoopCount++;
                        //whetherShaExistedUnderMasterNodeDbAlso check from master operationLogSummarySha
                        this.diskDataNodeInfoRecord.operationLogSummaryShaSelect("1","where latestCheckOperationSha=? and isActive=1",[item.latestCheckOperationSha],"",function(rows){
                            
                            if(rows!==undefined&&rows.length<=0){
                                whetherShaExistedUnderMasterNodeDbAlso=false;
                                
                            }

                            //if not equal with eachother,send failed message to crystal cluster node via http
                            if(whetherShaEqualWithEachOther===false||(whetherShaExistedUnderMasterNodeDbAlso===false&&item.isResendReqOrNot===false))
                            {
                                                                                
                                                    var domainUrl=item.comeFromCrystalNodeIp+":"+item.replyToCrystalNodePort;
                                                                var partialUrl="/crystalTalkingReceiver";
                                                                var qs=""
                                                                var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                                                var body={
                                                                    'type':'opLogSummaryShaConfirmResult',
                                                                    'shaCheckGuid':item.shaCheckGuid,
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
                                                
                                               //record self confirmation
                                                this.diskDataNodeInfoRecord.operationLogSummaryShaUpdateIsConfirmedByMaster(item.shaCheckGuid,true,diskDataCommon.getCurrentServerIpAdress().trim());
                                                //if equal with eachother,send confirm message to crystal cluster node via http
                                                var domainUrl=item.comeFromCrystalNodeIp+":"+item.replyToCrystalNodePort;
                                                            var partialUrl="/crystalTalkingReceiver";
                                                            var qs=""
                                                            var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                                            var body={
                                                                'type':'opLogSummaryShaConfirmResult',
                                                                'shaCheckGuid':item.shaCheckGuid,
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
                                    
                                            
                        }.bind(this));

                         

                        
                        
                                
                    }
                        
                    
            }

        }
 }
//(4)As a work sub node,execute restore command as per isNeedRestore flag.
 DecideAndAction.prototype.executeDataRestore=function(){
     //make wetherStopGeneralProcess flag to stop processing new request log & send summary sha to master & receive operation-log verification result at this moment.
     this.diskDataNodeInfoRecord.operationLogSummaryShaSelect("1","where isActive=1 and isNeedRestore=1",[""],"order by createTime desc",function(rows){
          
        if(rows!==undefined&&rows.length>0){

            let currentShaCheckGuid=rows[0].shaCheckGuid;
            let currentConfirmedByMasterIp=rows[0].confirmedByMasterIp;
            this.wetherStopGeneralProcess=true;
            let checkTimePoint=diskDataCommon.GetFormatDateFromTimeSpan(Date.now());
              //back up current sub node self opertion log table to shadow operation log table
              this.diskDataNodeInfoRecord.operationLogShadowDelete(function(result){
                  if(result!==undefined){
                    this.diskDataNodeInfoRecord.operationLogShadowBackUpFromOperationLog();
                  }
              }.bind(this));
              //clean current sub node self operation log table.
              this.diskDataNodeInfoRecord.operationLogDeleteAll(function(result){
                    if(result!==undefined){
                        //import opertion log seeked from master node to current sub node self opertion log table.
                        var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                        crystalClusterInfoRecord.crystalClusterBlockSelect("1","where crstalNodeRole=0 and crystalNodeIp<>?",[diskDataCommon.getCurrentServerIpAdress().trim()],"", function(rows){
                            if(rows!=undefined)
                            {
                                   //let  randomNodeIndex=diskDataCommon.GetRandomNum(0,rows.length-1);
                                    let  currentMasterNodeIp=rows[0].crystalNodeIp;
                                    let  currentMasterNodePort=rows[0].crystalNodePort;
                                    if(currentMasterNodeIp.trim()!==diskDataCommon.getCurrentServerIpAdress().trim()
                                    ||currentMasterNodeIp.trim()==="127.0.0.1")
                                    {
                                        var domainUrl=currentMasterNodeIp+":"+currentMasterNodePort;
                                        var partialUrl="/crystalTalkingReceiver";
                                        var qs=""
                                        var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                        var body={
                                            'type':'opExportOperationLog',
                                            'checkTimePoint':checkTimePoint
                                          
                                        };
                                        DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){
                                                    //then wait get confirmation&approve from master via another talking function
                                                    //console.log(res);
                                                    if(res!=null&&res!=undefined&&res.result===true&&res.value!==[]){

                                                       this.diskDataNodeInfoRecord.operationLogLandingDeleteAll(function(result){
                                                             if(result!==undefined){
                                                                  
                                                                  for(let item of res.value){
                                                                    var operationLogLanding=new OperationLogLanding();
                                                                     operationLogLanding.appGuid=item.appGuid;
                                                                     operationLogLanding.appId=item.appId;
                                                                     operationLogLanding.bizUserRoleId=item.bizUserRoleId;
                                                                     operationLogLanding.devLangId=item.devLangId;
                                                                     operationLogLanding.docId=item.docId;
                                                                     operationLogLanding.exfModuleId=item.exfModuleId;
                                                                     operationLogLanding.operationLogGuid=item.operationLogGuid;
                                                                     operationLogLanding.operationLogTime=item.operationLogTime;
                                                                     operationLogLanding.operationStatusId=item.operationStatusId;
                                                                     operationLogLanding.operationStorageClusterType=item.operationStorageClusterType;
                                                                     operationLogLanding.operationType=item.operationType;
                                                                     operationLogLanding.platformActionId=item.platformActionId;
                                                                     operationLogLanding.platformControllerId=item.platformControllerId;
                                                                     operationLogLanding.targetDbName=item.targetDbName;
                                                                     operationLogLanding.userGuid=item.userGuid;
                                                                     operationLogLanding.userId=item.userId;
                                                                     operationLogLanding.userName=item.userName;
                                                                     operationLogLanding.usingObjectId=item.usingObjectId;
                                                                     operationLogLanding.viewId=item.viewId;
                                                                     operationLogLanding.workFlowStatusId=item.workFlowStatusId;
                                                                     operationLogLanding.writeSql=item.writeSql;
                                                                     operationLogLanding.writeSqlSha=item.writeSqlSha;
                                                                     operationLogLanding.deviceId=item.deviceId;
                                                                     this.diskDataNodeInfoRecord.operationLogLandingInsert(operationLogLanding,function(result){
                                                                          if(result){
                                                                            //clear all the tables'data under current node's biz database.
                                                                            this.diskDataNodeInfoRecord.showTablesBaseOnDBName(conf.diskDataDBConf.dbConfig.database.toUpperCase(),function(rows){
                                                                               
                                                                                if(rows!==undefined&&rows.length>0){
                                                                                    let deleteCount=0;
                                                                                    for(let row of rows){
                                                                                      this.diskDataNodeInfoRecord.deleteTablesByName(row.TABLE_NAME,function(result){
                                                                                          if(result!==undefined){
                                                                                              deleteCount++;
                                                                                          }

                                                                                          if(deleteCount===rows.length){
                                                                                                //copy data from operationLog landing table to operationLog table
                                                                                                this.diskDataNodeInfoRecord.copyOperationLogFromOperationLogLanding(function(result){
                                                                                                    if(result){
                                                                                                        //base on current operation log table's records,do it base on its creatTime one by one non-desc.
                                                                                                        this.diskDataNodeInfoRecord.operationLogSelect("","",[""],"order by operationLogTime",function(rows){
                                                                                                            let executeCount=0;
                                                                                                            for(let row of rows){
                                                                                                                let dataOperator=new DataOperator();
                                                                                                                dataOperator.executeWrite(row.writeSql,function(result){
                                                                                                                        
                                                                                                                    if(result!=false){
                                                                                                                        executeCount++;
                                                                                                                       console.log("one operationLog has been restored successfully.")
                                                                                                                    } 
                                                                                                                    if(executeCount===rows.length){
                                                                                                                        //clean up operation log shadow table's former backup.
                                                                                                                          this.diskDataNodeInfoRecord.operationLogShadowDelete(function(result){});
                                                                                                                          this.diskDataNodeInfoRecord.operationLogLandingDeleteAll(function(result){});
                                                                                                                          this.diskDataNodeInfoRecord.operationLogSummaryShaUpdateIsConfirmedByMaster(currentShaCheckGuid,true,currentConfirmedByMasterIp);
                                                                                                                         //make wetherStopGeneralProcess flag to stop processing new request log & send summary sha to master & receive operation-log verification result at this moment.
                                                                                                                          this.wetherStopGeneralProcess=false;
                                                                                                                    }


                                                                                                                }.bind(this),row.operationStorageClusterType);
                                                                                                            }

                                                                                                            
                                                                                                           

                                                                                                        }.bind(this));
                                                                                                       
                                                                                                    }
                                                                                                    
                                                                                                }.bind(this))
                                                                                               
                                                                                          }
                                                                                      }.bind(this))
                                                                                    }
                                                                                }
                                                                                
                                                                            }.bind(this),conf.platformArch.serviceFor.reqStorageClusterType)
                                                                              
                                                                          }
                                                                     }.bind(this));
                                                                  }
                                                             }


                                                       }.bind(this))
                                                   
                                                        

                                                    }
    
                                        }.bind(this));
                                        
                                    }
                            }
                        }.bind(this));
                             
                    }
                  
              }.bind(this));
              
        }

      
      
     }.bind(this));
       

  
}

module.exports = DecideAndAction;