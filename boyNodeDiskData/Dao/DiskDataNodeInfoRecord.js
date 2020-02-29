'use strict'
var DiskDataDbHelper= require('./boyDiskDataDBHelper');
var conf=require("../src/config");
var diskDataCommon=require('../src/boyDiskDataCommon');

function DiskDataNodeInfoRecord(){
    this.DiskDataDb=new DiskDataDbHelper();
};

//RequestLog insert,update,select,delete
DiskDataNodeInfoRecord.prototype.RequestLogInsert=function(RequestLog){

     
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig; 
    this.DiskDataDb.mysqlParameter.common.sql = "insert into RequestLog (appId,appName,appGuid,userId,url,createTime,reqStorageClusterType,reqGuid,isActive,userGuid,writeSqlSha,writeSql,isConfirmedByMaster,targetDbName) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    this.DiskDataDb.mysqlParameter.common.params = [RequestLog.appId,RequestLog.appName,RequestLog.appGuid,RequestLog.userId,RequestLog.url,RequestLog.createTime,RequestLog.reqStorageClusterType,RequestLog.reqGuid,RequestLog.isActive,RequestLog.userGuid,RequestLog.writeSqlSha,RequestLog.writeSql,RequestLog.isConfirmedByMaster,RequestLog.targetDbName];
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err); 
              console.log(success,"--RequestLog is inserted failed!"); 
              return false;
        }else
        {
          if(insertId!=undefined){
             
              console.log(success,"--RequestLog is inserted successfully!");
              return true;
          }

        }
      
    }
    this.DiskDataDb.add();
};

DiskDataNodeInfoRecord.prototype.RequestLogUpdate=function(RequestLog){   
   
    this.DiskDataDb.dbType = 'mysql'; 
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;   
    this.DiskDataDb.mysqlParameter.common.sql ="update RequestLog set appId=?,appName=?,appGuid=?,userId=?,url=?,createTime=?,reqStorageClusterType=?,isActive=?,userGuid=?,writeSqlSha=?,writeSql=? where reqGuid=?";
    this.DiskDataDb.mysqlParameter.common.params=[RequestLog.appId,RequestLog.appName,RequestLog.appGuid,RequestLog.userId,RequestLog.url,RequestLog.createTime,RequestLog.reqStorageClusterType,RequestLog.isActive,RequestLog.userGuid,RequestLog.writeSqlSha,RequestLog.writeSql,RequestLog.reqGuid];
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--RequestLog is updated successfully!");
                return true;
            }else{
                console.log(success,"--RequestLog is updated failed!");
                return false;
            }
        }
    }
    this.DiskDataDb.update();
  };

DiskDataNodeInfoRecord.prototype.RequestLogIsActiveUpdate=function(RequestLog){   
   
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;      
    this.DiskDataDb.mysqlParameter.common.sql ="update RequestLog set isActive=? where reqGuid=?";
    this.DiskDataDb.mysqlParameter.common.params=[RequestLog.isActive,RequestLog.reqGuid];
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--RequestLog isActive is updated successfully!");
                return true;
            }else{
                console.log(success,"--RequestLog isActive is updated failed!");
                return false;
            }
        }
    }
    this.DiskDataDb.update();
  };

  DiskDataNodeInfoRecord.prototype.RequestLogIsConfirmedUpdate=function(RequestLog){   
   
    console.log("start update RequestLogIsConfirmedUpdate for reqGuid:",RequestLog.reqGuid);
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;      
    this.DiskDataDb.mysqlParameter.common.sql ="update RequestLog set isConfirmedByMaster=?,confirmedByMasterIp=? where reqGuid=?";
    this.DiskDataDb.mysqlParameter.common.params=[RequestLog.isConfirmedByMaster,RequestLog.comeFromCrystalNodeIp,RequestLog.reqGuid];
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--RequestLog isConfirmedByMaster is updated successfully!");
                return true;
            }else{
                console.log(success,"--RequestLog isConfirmedByMaster is updated failed!");
                return false;
            }
        }
    }
    this.DiskDataDb.update();
  };

  DiskDataNodeInfoRecord.prototype.RequestLogIsConfirmedUpdateByWriteSha=function(isConfirmedByMaster,writeSqlSha,writeSql){   
   
     
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;      
    this.DiskDataDb.mysqlParameter.common.sql ="update RequestLog set isConfirmedByMaster=? where writeSqlSha=? and writeSql=?";
    this.DiskDataDb.mysqlParameter.common.params=[isConfirmedByMaster,writeSqlSha,writeSql];
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--RequestLog isConfirmedByMaster is updated successfully!");
                return true;
            }else{
                console.log(success,"--RequestLog isConfirmedByMaster is updated failed!");
                return false;
            }
        }
    }
    this.DiskDataDb.update();
  };

  DiskDataNodeInfoRecord.prototype.RequestLogIsSentToMasterUpdate=function(isSentToMaster,reqGuid){   
   
    this.DiskDataDb.dbType = 'mysql';    
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;  
    this.DiskDataDb.mysqlParameter.common.sql ="update RequestLog set isSentToMaster=?,sendToMasterTime=? where reqGuid=?";
    this.DiskDataDb.mysqlParameter.common.params=[isSentToMaster,diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),reqGuid];
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--RequestLog isSentToMaster is updated successfully!");
                return true;
            }else{
                console.log(success,"--RequestLog isSentToMaster is updated failed!");
                return false;
            }
        }
    }
    this.DiskDataDb.update();
  };


  DiskDataNodeInfoRecord.prototype.RequestLogSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    this.DiskDataDb.dbType = 'mysql';   
    this.DiskDataDb.mysqlParameter.select.tableName='RequestLog';
    this.DiskDataDb.mysqlParameter.select.topNumber=topNumber;
    this.DiskDataDb.mysqlParameter.select.whereSql=whereSql;
    this.DiskDataDb.mysqlParameter.select.params=params;
    this.DiskDataDb.mysqlParameter.select.orderSql=orderBySql;
    this.DiskDataDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to RequestLogSelect from current node db')
         if(err)
         {
            console.log(err);
            console.log('Failed to RequestLogSelect from current node db');  
            callBack(undefined); 
         }
         else
         {
            callBack(rows); 
           
         }
    };
    this.DiskDataDb.select();
}

DiskDataNodeInfoRecord.prototype.RequestLogDelete=function(reqId){
    
    this.DiskDataDb.dbType = 'mysql'; 
    this.DiskDataDb.mysqlParameter.del.tableName="RequestLog";
    this.DiskDataDb.mysqlParameter.del.whereSql="where reqId=?";
    this.DiskDataDb.mysqlParameter.del.params=[reqId];
    this.DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--RequestLog is deleted successfully!");
                return true;
            }else{
                console.log(success,"--RequestLog is deleted failed!");
                return false;
            }
        }
    };
    this.DiskDataDb.del();   
}

//operationLog insert,update,select,delete
DiskDataNodeInfoRecord.prototype.operationLogInsert=function(operationLog){

     
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;
    this.DiskDataDb.mysqlParameter.common.sql = "insert into operationLog (operationStorageClusterType,operationLogGuid,userId,userName,operationType,operationLogTime,appId,docId,exfModuleId,viewId,platformControllerId,platformActionId,usingObjectId,bizUserRoleId,deviceId,devLangId,operationStatusId,userGuid,appGuid,workFlowStatusId,writeSqlSha,writeSql) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    this.DiskDataDb.mysqlParameter.common.params = [operationLog.operationStorageClusterType,operationLog.operationLogGuid,operationLog.userId,operationLog.userName,operationLog.operationType,operationLog.operationLogTime,operationLog.appId,operationLog.docId,operationLog.exfModuleId,operationLog.viewId,operationLog.platformControllerId,operationLog.platformActionId,operationLog.usingObjectId,operationLog.bizUserRoleId,operationLog.deviceId,operationLog.devLangId,operationLog.operationStatusId,operationLog.userGuid,operationLog.appGuid,operationLog.workFlowStatusId,operationLog.writeSqlSha,operationLog.writeSql]; 
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err); 
              console.log(success,"--operationLog is inserted failed!"); 
              return false;
        }else
        {
          if(insertId!=undefined){
             
              console.log(success,"--operationLog is inserted successfully!");
              return true;
          }

        }
      
    }
    this.DiskDataDb.add();
};

DiskDataNodeInfoRecord.prototype.operationLogUpdate=function(operationLog){

     
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;
    this.DiskDataDb.mysqlParameter.common.sql = "update operationLog set  operationStorageClusterType=?,userId=?,userName=?,operationType=?,operationLogTime=?,appId=?,docId=?,exfModuleId=?,viewId=?,platformControllerId=?,platformActionId=?,usingObjectId=?,bizUserRoleId=?,deviceId=?,devLangId=?,operationStatusId=?,userGuid=?,appGuid=?,workFlowStatusId=?,writeSqlSha=?,writeSql=? where  operationLogGuid=? ";
    this.DiskDataDb.mysqlParameter.common.params = [operationLog.operationStorageClusterType,operationLog.userId,operationLog.userName,operationLog.operationType,operationLog.operationLogTime,operationLog.appId,operationLog.docId,operationLog.exfModuleId,operationLog.viewId,operationLog.platformControllerId,operationLog.platformActionId,operationLog.usingObjectId,operationLog.bizUserRoleId,operationLog.deviceId,operationLog.devLangId,operationLog.operationStatusId,operationLog.userGuid,operationLog.appGuid,operationLog.workFlowStatusId,operationLog.writeSqlSha,operationLog.writeSql,operationLog.operationLogGuid]; 
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err); 
              console.log(success,"--operationLog is updated failed!"); 
              return false;
        }else
        {
          if(insertId!=undefined){
             
              console.log(success,"--operationLog is updated successfully!");
              return true;
          }

        }
      
    }
    this.DiskDataDb.update();
};

DiskDataNodeInfoRecord.prototype.operationLogSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    this.DiskDataDb.dbType = 'mysql';    
    this.DiskDataDb.mysqlParameter.select.tableName='operationLog';
    this.DiskDataDb.mysqlParameter.select.topNumber=topNumber;
    this.DiskDataDb.mysqlParameter.select.whereSql=whereSql;
    this.DiskDataDb.mysqlParameter.select.params=params;
    this.DiskDataDb.mysqlParameter.select.orderSql=orderBySql;
    this.DiskDataDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to operationLogSelect from current node db')
         if(err)
         {
            console.log('Failed to operationLogSelect from current node db');  
            callBack(undefined); 
         }
         else
         {
            callBack(rows); 
           
         }
    };
    this.DiskDataDb.select();
}

DiskDataNodeInfoRecord.prototype.operationLogDelete=function(operationLogId){
    
    this.DiskDataDb.dbType = 'mysql'; 
    this.DiskDataDb.mysqlParameter.del.tableName="operationLog";
    this.DiskDataDb.mysqlParameter.del.whereSql="where operationLogId=?";
    this.DiskDataDb.mysqlParameter.del.params=[operationLogId];
    this.DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--operationLog is deleted successfully!");
                return true;
            }else{
                console.log(success,"--operationLog is deleted failed!");
                return false;
            }
        }
    };
    this.DiskDataDb.del();   
}

DiskDataNodeInfoRecord.prototype.operationLogDeleteAll=function(callBack){
    
    this.DiskDataDb.dbType = 'mysql'; 
    this.DiskDataDb.mysqlParameter.del.tableName="operationLog";
    this.DiskDataDb.mysqlParameter.del.whereSql="where operationLogId>?";
    this.DiskDataDb.mysqlParameter.del.params=[0];
    this.DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            callBack(undefined);
        }else
        {
            if(success){
                console.log(success,"--operationLog is deleted all successfully!");
                callBack(true);
            }else{
                console.log(success,"--operationLog is deleted all failed!");
                callBack(false);
            }
        }
    };
    this.DiskDataDb.del();   
}

//operationLogSummarySha insert,update,select,delete
DiskDataNodeInfoRecord.prototype.operationLogSummaryShaInsert=function(OperationLogSummarySha){
       
        this.DiskDataDb.dbType = 'mysql';
        this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;
        this.DiskDataDb.mysqlParameter.common.sql = "insert into operationLogSummarySha (latestCheckOperationSha,createTime,shaCheckGuid) values (?,?,?)";
        this.DiskDataDb.mysqlParameter.common.params = [OperationLogSummarySha.latestCheckOperationSha,OperationLogSummarySha.createTime,OperationLogSummarySha.shaCheckGuid]; 
        this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
        
            if(err)
            {
                console.dir(err); 
                console.log(success,"--operationLogSummarySha is inserted failed!"); 
                return false;
            }else
            {
            if(insertId!=undefined){
                
                console.log(success,"--operationLogSummarySha is inserted successfully!");
                return true;
            }

            }
        
        }
        this.DiskDataDb.add();
}
DiskDataNodeInfoRecord.prototype.operationLogSummaryShaUpdateIsConfirmedByMaster=function(shaCheckGuid,isConfirmedByMaster,confirmedByMasterIp){
    
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;
    this.DiskDataDb.mysqlParameter.common.sql = "update operationLogSummarySha set  isConfirmedByMaster=?,isActive=?,confirmedByMasterIp=?  where  shaCheckGuid=? ";
    if(isConfirmedByMaster){
       this.DiskDataDb.mysqlParameter.common.params = [isConfirmedByMaster,false,confirmedByMasterIp,shaCheckGuid]; 
    }else{
       this.DiskDataDb.mysqlParameter.common.params = [isConfirmedByMaster,true,confirmedByMasterIp,shaCheckGuid]; 
    }
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err); 
              console.log(success,"--operationLogSummarySha isConfirmedByMaster is updated failed!"); 
              return false;
        }else
        {
          if(insertId!=undefined){
             
              console.log(success,"--operationLogSummarySha isConfirmedByMaster is updated successfully!");
              return true;
          }

        }
      
    }
    this.DiskDataDb.update();

}

DiskDataNodeInfoRecord.prototype.operationLogSummaryShaUpdateNotMatchedCount=function(shaCheckGuid,callBack){
       
        this.DiskDataDb.dbType = 'mysql';
        this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;
        this.DiskDataDb.mysqlParameter.common.sql = "update operationLogSummarySha set  notMatchedCount=notMatchedCount+1  where  shaCheckGuid=? ";
        this.DiskDataDb.mysqlParameter.common.params = [shaCheckGuid]; 
        this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
        
            if(err)
            {
                console.dir(err); 
                console.log(success,"--operationLogSummarySha notMatchedCount is updated failed!"); 
                callBack(false);
            }else
            {
            if(insertId!=undefined){
                
                console.log(success,"--operationLogSummarySha notMatchedCount is updated successfully!");
                callBack(true);
            }

            }
        
        }
        this.DiskDataDb.update();
}

DiskDataNodeInfoRecord.prototype.operationLogSummaryShaUpdateIsSendToMaster=function(isSendToMaster,shaCheckGuid){
       
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;
    this.DiskDataDb.mysqlParameter.common.sql = "update operationLogSummarySha set  isSendToMaster=?,sendToMasterTime=?  where  shaCheckGuid=? ";
    this.DiskDataDb.mysqlParameter.common.params = [isSendToMaster,diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),shaCheckGuid]; 
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
    
        if(err)
        {
            console.dir(err); 
            console.log(success,"--operationLogSummarySha isSendToMaster is updated failed!"); 
            return false;
        }else
        {
        if(insertId!=undefined){
            
            console.log(success,"--operationLogSummarySha isSendToMaster is updated successfully!");
            return true;
        }

        }
    
    }
    this.DiskDataDb.update();
}

DiskDataNodeInfoRecord.prototype.operationLogSummaryShaUpdateIsNeedRestore=function(shaCheckGuid,definedOperationLogCheckFailedTimes){
       
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;
    this.DiskDataDb.mysqlParameter.common.sql = "update operationLogSummarySha set  isNeedRestore=1 and notMatchedCount>=?  where  shaCheckGuid=? ";
    this.DiskDataDb.mysqlParameter.common.params = [definedOperationLogCheckFailedTimes,shaCheckGuid]; 
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
    
        if(err)
        {
            console.dir(err); 
            console.log(success,"--operationLogSummarySha isNeedRestore is updated failed!"); 
            return false;
        }else
        {
        if(insertId!=undefined){
            
            console.log(success,"--operationLogSummarySha isNeedRestore is updated successfully!");
            return true;
        }

        }
    
    }
    this.DiskDataDb.update();
}

DiskDataNodeInfoRecord.prototype.operationLogSummaryShaSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    this.DiskDataDb.dbType = 'mysql';    
    this.DiskDataDb.mysqlParameter.select.tableName='operationLogSummarySha';
    this.DiskDataDb.mysqlParameter.select.topNumber=topNumber;
    this.DiskDataDb.mysqlParameter.select.whereSql=whereSql;
    this.DiskDataDb.mysqlParameter.select.params=params;
    this.DiskDataDb.mysqlParameter.select.orderSql=orderBySql;
    this.DiskDataDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to operationLogSummaryShaSelect from current node db')
         if(err)
         {
            console.log('Failed to operationLogSummaryShaSelect from current node db');  
            callBack(undefined); 
         }
         else
         {
            callBack(rows); 
           
         }
    };
    this.DiskDataDb.select();
}

DiskDataNodeInfoRecord.prototype.operationLogSummaryShaDelete=function(shaCheckId){
        this.DiskDataDb.dbType = 'mysql'; 
        this.DiskDataDb.mysqlParameter.del.tableName="operationLogSummarySha";
        this.DiskDataDb.mysqlParameter.del.whereSql="where shaCheckId=?";
        this.DiskDataDb.mysqlParameter.del.params=[shaCheckId];
        this.DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
            if (err) {
                console.dir(err);  
                return false;
            }else
            {
                if(success){
                    console.log(success,"--operationLogSummarySha is deleted successfully!");
                    return true;
                }else{
                    console.log(success,"--operationLogSummarySha is deleted failed!");
                    return false;
                }
            }
        };
        this.DiskDataDb.del(); 
}

DiskDataNodeInfoRecord.prototype.checkedOperationLogSummaryShaDelete=function(){
    this.DiskDataDb.dbType = 'mysql'; 
    this.DiskDataDb.mysqlParameter.del.tableName="operationLogSummarySha";
    this.DiskDataDb.mysqlParameter.del.whereSql="where isConfirmedByMaster=1 and isActive=0";
    this.DiskDataDb.mysqlParameter.del.params=[""];
    this.DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--checked OperationLogSummarySha is deleted successfully!");
                return true;
            }else{
                console.log(success,"--checked OperationLogSummarySha is deleted failed!");
                return false;
            }
        }
    };
    this.DiskDataDb.del(); 
}

//operationLogShadow delete
DiskDataNodeInfoRecord.prototype.operationLogShadowDelete=function(callBack){
    this.DiskDataDb.dbType = 'mysql'; 
    this.DiskDataDb.mysqlParameter.del.tableName="operationLogShadow";
    this.DiskDataDb.mysqlParameter.del.whereSql="where shaCheckId>?";
    this.DiskDataDb.mysqlParameter.del.params=[0];
    this.DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            callBack(undefined);
        }else
        {
            if(success){
                console.log(success,"--operationLogShadow is deleted successfully!");
                callBack(true);
            }else{
                console.log(success,"--operationLogShadow is deleted failed!");
                callBack(false);
            }
        }
    };
    this.DiskDataDb.del(); 
}

DiskDataNodeInfoRecord.prototype.operationLogShadowBackUpFromOperationLog=function(){

    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.sql ="insert into operationLogShadow (select operationStorageClusterType,operationLogGuid,userId,userName,operationType,operationLogTime,appId,docId,exfModuleId,viewId,platformControllerId,platformActionId,usingObjectId,bizUserRoleId,deviceId,devLangId,operationStatusId,userGuid,appGuid,workFlowStatusId,writeSqlSha,writeSql,targetDbName from operationLog)";
    this.DiskDataDb.mysqlParameter.common.params=[""];
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.diskDataDBConf;
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, res) {
 
        if(err)
        {
              console.dir(err);  
              callBack(false);
        }else
        {
            callBack(true);

        }
      
    };
    this.DiskDataDb.querySql();
}

//operationLogLanding insert,delete
DiskDataNodeInfoRecord.prototype.operationLogLandingInsert=function(OperationLogLanding,callBack){
       
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig;
    this.DiskDataDb.mysqlParameter.common.sql = "insert into operationLogLanding (operationStorageClusterType,operationLogGuid,userId,userName,operationType,operationLogTime,appId,docId,exfModuleId,viewId,platformControllerId,platformActionId,usingObjectId,bizUserRoleId,deviceId,devLangId,operationStatusId,userGuid,appGuid,workFlowStatusId,writeSqlSha,writeSql) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    this.DiskDataDb.mysqlParameter.common.params = [OperationLogLanding.operationStorageClusterType,OperationLogLanding.operationLogGuid,OperationLogLanding.userId,OperationLogLanding.userName,OperationLogLanding.operationType,OperationLogLanding.operationLogTime,OperationLogLanding.appId,OperationLogLanding.docId,OperationLogLanding.exfModuleId,OperationLogLanding.viewId,OperationLogLanding.platformControllerId,OperationLogLanding.platformActionId,OperationLogLanding.usingObjectId,OperationLogLanding.bizUserRoleId,OperationLogLanding.deviceId,OperationLogLanding.devLangId,OperationLogLanding.operationStatusId,OperationLogLanding.userGuid,OperationLogLanding.appGuid,OperationLogLanding.workFlowStatusId,OperationLogLanding.writeSqlSha,OperationLogLanding.writeSql]; 
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
    
        if(err)
        {
            console.dir(err); 
            console.log(success,"--OperationLogLanding is inserted failed!"); 
            callBack(false);
        }else
        {
        if(insertId!=undefined){
            
            console.log(success,"--OperationLogLanding is inserted successfully!");
            callBack(true);
        }

        }
    
    }
    this.DiskDataDb.add();
}

DiskDataNodeInfoRecord.prototype.operationLogLandingDeleteAll=function(callBack){
    
    this.DiskDataDb.dbType = 'mysql'; 
    this.DiskDataDb.mysqlParameter.del.tableName="operationLogLanding";
    this.DiskDataDb.mysqlParameter.del.whereSql="where operationLogId>?";
    this.DiskDataDb.mysqlParameter.del.params=[0];
    this.DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            callBack(undefined);
        }else
        {
            if(success){
                console.log(success,"--operationLogLanding is deleted all successfully!");
                callBack(true);
            }else{
                console.log(success,"--operationLogLanding is deleted all failed!");
                callBack(false);
            }
        }
    };
    this.DiskDataDb.del();   
}

DiskDataNodeInfoRecord.prototype.copyOperationLogFromOperationLogLanding=function(callBack){

    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.sql ="insert into operationLog (select operationStorageClusterType,operationLogGuid,userId,userName,operationType,operationLogTime,appId,docId,exfModuleId,viewId,platformControllerId,platformActionId,usingObjectId,bizUserRoleId,deviceId,devLangId,operationStatusId,userGuid,appGuid,workFlowStatusId,writeSqlSha,writeSql,targetDbName from operationLogLanding)";
    this.DiskDataDb.mysqlParameter.common.params=[""];
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.diskDataDBConf;
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, res) {
 
        if(err)
        {
              console.dir(err);  
              callBack(false);
        }else
        {
            callBack(true);

        }
      
    };
    this.DiskDataDb.querySql();
}


DiskDataNodeInfoRecord.prototype.showDataBases=function(callBack){
    
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig; 
    this.DiskDataDb.mysqlParameter.common.sql ="show databases";
    this.DiskDataDb.mysqlParameter.common.params=[""];
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, rows) {
      
        if(err)
        {
              console.dir(err);  
              callBack(undefined);
        }else
        {
            callBack(rows);

        }
      
    };
    this.DiskDataDb.querySql();
}

DiskDataNodeInfoRecord.prototype.showTablesBaseOnDBName=function(DbName,callBack){
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.mysqlConfig; 
    this.DiskDataDb.mysqlParameter.common.sql ="select TABLE_NAME from information_schema.TABLES where TABLE_SCHEMA=?";
    this.DiskDataDb.mysqlParameter.common.params=[DbName];
    this.DiskDataDb.mysqlParameter.common.callBack = function (err, rows) {
      
        if(err)
        {
              console.dir(err);  
              callBack(undefined);
        }else
        {
            callBack(rows);

        }
      
    };
    this.DiskDataDb.querySql();
}

DiskDataNodeInfoRecord.prototype.deleteTablesByName=function(tableName,callback){
    this.DiskDataDb.dbType = 'mysql'; 
        this.DiskDataDb.mysqlParameter.del.tableName=tableName;
        this.DiskDataDb.mysqlParameter.del.whereSql="";
        this.DiskDataDb.mysqlParameter.del.params=[""];
        this.DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
            if (err) {
                console.dir(err);  
                return callback(undefined);
            }else
            {
                if(success){
                    console.log(success,"--",tableName," is deleted successfully!");
                    callback(true);
                }else{
                    console.log(success,"--",tableName," is deleted failed!");
                    callback(false);
                }
            }
        };
        this.DiskDataDb.del(); 
}

module.exports = DiskDataNodeInfoRecord;