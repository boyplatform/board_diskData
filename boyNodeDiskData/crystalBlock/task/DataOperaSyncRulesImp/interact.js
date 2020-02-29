'use strict'
require('date-utils');
var conf=require("../../../src/config");
var diskDataCommon=require('../../../src/boyDiskDataCommon.js');
var InodeCahce=require("../../../coreLibs/iNodeCache");
var RequestLog=require("../../../pojo/RequestLog");
var DiskDataNodeInfoRecord=require("../../../Dao/DiskDataNodeInfoRecord");



function Interact(){
    
   
    if(conf.redisPoolConfig!==undefined&&conf.redisClusterPoolConfig!==undefined)
    {
        if(conf.platformArch.redisMode==="cluster"){
            this.memoryNodeCache=new InodeCahce("redisCluster");
            this.memoryNodeCache.setConn(conf.redisClusterPoolConfig);
        }else{
            this.memoryNodeCache=new InodeCahce("redis");
            this.memoryNodeCache.setConn(conf.redisPoolConfig);
        }
        this.receivedTalkingMessage={};
        this.diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
       
         
    }else{
        console.log("Please finish your redis config");
    }
}

Interact.prototype.constructor=Interact;

Interact.prototype.getWriteOperationMessageStartForMockTest=function(message,targetDbName,appId,appName,appGuid,reqStorageClusterType,res){
           
    //change message into sha
    var writeSqlSha=diskDataCommon.getSha256(targetDbName+message,conf.platformArch.shaHashLengh);
    var userId=0,url='',userGuid='';
    //save sha message and message and other info into local nodeDB of requestLog
    var requestLog=new RequestLog(appId,appName,appGuid,userId,url,diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),reqStorageClusterType,diskDataCommon.getUUID(),true,userGuid,writeSqlSha,message,false,false,null,targetDbName);
    
    this.diskDataNodeInfoRecord.RequestLogInsert(requestLog);
    res.end(JSON.stringify({result:true,desc:"input mock test message successfully."}));

}

//(2.1)crystal cluster operation talking crystalTalkingMasterConfirmReqReceiver at master
Interact.prototype.crystalTalkingMasterConfirmReqReceiver= function(RequestLog){
    
    console.log("crystalTalkingMasterConfirmReqReceiver started");
    let currentOperationVerificationCube=this.receivedTalkingMessage[diskDataCommon.getSha256(RequestLog.writeSqlSha+RequestLog.writeSql,conf.platformArch.shaHashLengh)];
    if(currentOperationVerificationCube===undefined||currentOperationVerificationCube.length===0){
        this.receivedTalkingMessage[diskDataCommon.getSha256(RequestLog.writeSqlSha+RequestLog.writeSql,conf.platformArch.shaHashLengh)]=[RequestLog];
        currentOperationVerificationCube=this.receivedTalkingMessage[diskDataCommon.getSha256(RequestLog.writeSqlSha+RequestLog.writeSql,conf.platformArch.shaHashLengh)];
    }
    //verify whether receivedTalkingMessage's count is smaller than crystal crystalTalkingSize
    if(currentOperationVerificationCube.length<(conf.platformArch.crystalCluster.crystalTalkingSize))
    {
        let duplicateIpCount=0;
        for(let item of currentOperationVerificationCube){
             if(item.comeFromCrystalNodeIp===RequestLog.comeFromCrystalNodeIp){
                 duplicateIpCount++;
             }
        }
        if(duplicateIpCount===0||conf.platformArch.crystalCluster.allowDuplicateOpTalking===true){
           //if not put remote operation req into the receivedTalkingMessage
           this.receivedTalkingMessage[diskDataCommon.getSha256(RequestLog.writeSqlSha+RequestLog.writeSql,conf.platformArch.shaHashLengh)].push(RequestLog);
           return JSON.stringify({result:true,desc:"Write message was pushed into master node for verification successfully."});
        }else{
           return JSON.stringify({result:false,desc:"Write message was pushed into master node for verification failed."});
        }

    }else{
        return JSON.stringify({result:false,desc:"Write message was pushed into master node for verification failed."});
    } 
      
    
};


//(3)crystal cluster operation master-confirmation&approve receiver
Interact.prototype.crystalTalkingOperationConfirmReceiver=function(RequestLog){
    console.log("crystalTalkingOperationConfirmReceiver started");
     //verify whether coming requestLog was confirmed by current master node
      if(RequestLog.whetherConfirm===false){
          //if coming requestLog was not confirmed by currrent master node, set the request log as not-active(then using a job to remove it timely)
          RequestLog.isActive=false;
          this.diskDataNodeInfoRecord.RequestLogIsActiveUpdate(RequestLog);
          return JSON.stringify({result:false,desc:"sub node get master node confirmation failed."});
       }else{
          //if coming requestLog was confirmed by current master node, set the request log isConfirmedByMaster=true and waiting from terminal job execution.
          RequestLog.isConfirmedByMaster=true;
          this.diskDataNodeInfoRecord.RequestLogIsConfirmedUpdate(RequestLog);
          return JSON.stringify({result:true,desc:"sub node get master node confirmation successfully."});
       }
};


module.exports=Interact;
