'use strict'
var conf=require("../src/config");
function RequestLog(appId,appName,appGuid,userId,url,createTime,reqStorageClusterType,reqGuid,isActive,userGuid,writeSqlSha,writeSql,isConfirmedByMaster,isSentToMaster,comeFromCrystalNodeIp,targetDbName){
    
     
    this.appId=appId;
    this.appName=appName;
    this.appGuid=appGuid;
    this.userId=userId;
    this.url=url;
    this.createTime=createTime;
    this.reqStorageClusterType=reqStorageClusterType;
    this.reqGuid=reqGuid;
    this.isActive=isActive;
    this.userGuid=userGuid;
    this.writeSqlSha=writeSqlSha;
    this.writeSql=writeSql;
    this.isConfirmedByMaster=isConfirmedByMaster;
    this.isSentToMaster=isSentToMaster;
    this.targetDbName=targetDbName;
    this.sendToMasterTime=undefined;
    //non-db attributes
    this.comeFromCrystalNodeIp=comeFromCrystalNodeIp;
    this.replyToCrystalNodePort=conf.platformArch.crystalCluster.defaultTalkingPort;
    this.whetherConfirm=false;
    this.isResendReqOrNot=false;
};

RequestLog.prototype.constructor=RequestLog;

module.exports = RequestLog;