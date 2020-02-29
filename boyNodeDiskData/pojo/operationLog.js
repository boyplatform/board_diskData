'use strict'
function OperationLog(operationStorageClusterType,operationLogGuid,userId,userName,operationType,operationLogTime,appId,docId,exfModuleId,viewId,
    platformControllerId,platformActionId,usingObjectId,bizUserRoleId,deviceId,devLangId,operationStatusId,userGuid,appGuid,workFlowStatusId,writeSqlSha,writeSql,targetDbName){
    
    
    this.operationStorageClusterType=operationStorageClusterType;
    this.operationLogGuid=operationLogGuid;
    this.appGuid=appGuid;
    this.userId=userId;
    this.userName=userName;
    this.operationType=operationType;
    this.operationLogTime=operationLogTime;
    this.appId=appId;
    this.docId=docId;
    this.exfModuleId=exfModuleId;
    this.viewId=viewId;
    this.platformControllerId=platformControllerId;
    this.platformActionId=platformActionId;
    this.usingObjectId=usingObjectId;
    this.bizUserRoleId=bizUserRoleId;
    this.deviceId=deviceId;
    this.devLangId=devLangId;
    this.operationStatusId=operationStatusId;
    this.userGuid=userGuid;
    this.appGuid=appGuid;
    this.workFlowStatusId=workFlowStatusId;
    this.writeSqlSha=writeSqlSha;
    this.writeSql=writeSql;
    this.targetDbName=targetDbName;
};

OperationLog.prototype.constructor=OperationLog;

module.exports = OperationLog;