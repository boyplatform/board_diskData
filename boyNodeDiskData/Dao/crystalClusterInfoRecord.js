'use strict'
var DiskDataDbHelper= require('./boyDiskDataDBHelper');
var DiskDataDb=new DiskDataDbHelper();

function CrystalClusterInfoRecord(){

}; 

//crystalClusterBlock insert,update,select,delete
CrystalClusterInfoRecord.prototype.crystalClusterBlockInsert=function(crystalClusterBlock){
   
    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="insert into crystalClusterBlock (crystalNodeGuid,crystalNodeIp,crystalNodePort,interactProtocolType,mem_totalHeap,mem_heapUsed,mem_totalForCurrentProcess,mem_totalOnV8EngineUsing,mem_usedMemRate,cpuArch,cpuInfo,freemem,hostName,loadAvg,networkInterface,platformtype,platformVersion,osTempDir,totalMemory,osType,nodeNormalRunedTime,crstalNodeRole) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    DiskDataDb.mysqlParameter.common.params = [crystalClusterBlock.crystalNodeGuid,crystalClusterBlock.crystalNodeIp,crystalClusterBlock.crystalNodePort,crystalClusterBlock.interactProtocolType,crystalClusterBlock.mem_totalHeap,crystalClusterBlock.mem_heapUsed,crystalClusterBlock.mem_totalForCurrentProcess,crystalClusterBlock.mem_totalOnV8EngineUsing,crystalClusterBlock.mem_usedMemRate,crystalClusterBlock.cpuArch,crystalClusterBlock.cpuInfo,crystalClusterBlock.freemem,crystalClusterBlock.hostName,crystalClusterBlock.loadAvg,crystalClusterBlock.networkInterface,crystalClusterBlock.platformtype,crystalClusterBlock.platformVersion,crystalClusterBlock.osTempDir,crystalClusterBlock.totalMemory,crystalClusterBlock.osType,crystalClusterBlock.nodeNormalRunedTime,crystalClusterBlock.crstalNodeRole];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--crystalClusterBlock is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    DiskDataDb.add();
};

CrystalClusterInfoRecord.prototype.crystalClusterBlockUpdate=function(crystalClusterBlock){
    
    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="update crystalClusterBlock set crystalNodeIp=?,crystalNodePort=?,interactProtocolType=?,mem_totalHeap=?,mem_heapUsed=?,mem_totalForCurrentProcess=?,mem_totalOnV8EngineUsing=?,mem_usedMemRate=?,cpuArch=?,cpuInfo=?,freemem=?,hostName=?,loadAvg=?,networkInterface=?,platformtype=?,platformVersion=?,osTempDir=?,totalMemory=?,osType=?,nodeNormalRunedTime=? where crystalNodeGuid=?";
    DiskDataDb.mysqlParameter.common.params=[crystalClusterBlock.crystalNodeIp,crystalClusterBlock.crystalNodePort,crystalClusterBlock.interactProtocolType,crystalClusterBlock.mem_totalHeap,crystalClusterBlock.mem_heapUsed,crystalClusterBlock.mem_totalForCurrentProcess,crystalClusterBlock.mem_totalOnV8EngineUsing,crystalClusterBlock.mem_usedMemRate,crystalClusterBlock.cpuArch,crystalClusterBlock.cpuInfo,crystalClusterBlock.freemem,crystalClusterBlock.hostName,crystalClusterBlock.loadAvg,crystalClusterBlock.networkInterface,crystalClusterBlock.platformtype,crystalClusterBlock.platformVersion,crystalClusterBlock.osTempDir,crystalClusterBlock.totalMemory,crystalClusterBlock.osType,crystalClusterBlock.nodeNormalRunedTime,crystalClusterBlock.crystalNodeGuid];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--crystalClusterBlock is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    DiskDataDb.update();
};

CrystalClusterInfoRecord.prototype.crystalClusterBlockMasterUpdate=function(crystalClusterBlock){
    
    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="update crystalClusterBlock set crstalNodeRole=? where crystalNodeIp=?";
    DiskDataDb.mysqlParameter.common.params=[crystalClusterBlock.crstalNodeRole,crystalClusterBlock.crystalNodeIp];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--crystalClusterBlock master is updated successfully!");
                return true;
            }else{
                console.log(success,"--crystalClusterBlock master is updated failed!");
                return false;
            }
        }
    };
    DiskDataDb.update();
};

CrystalClusterInfoRecord.prototype.crystalClusterBlockSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    DiskDataDb.dbType = 'mysql';    
    DiskDataDb.mysqlParameter.select.tableName='crystalClusterBlock';
    DiskDataDb.mysqlParameter.select.topNumber=topNumber;
    DiskDataDb.mysqlParameter.select.whereSql=whereSql;
    DiskDataDb.mysqlParameter.select.params=params;
    DiskDataDb.mysqlParameter.select.orderSql=orderBySql;
    DiskDataDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to crystalClusterBlockSelect from current node db');
         if(err)
         {
           console.log('Failed to crystalClusterBlockSelect from current node db');  
           callBack(undefined);
         }
         else
         {
           callBack(rows);
           
         }
    };
    DiskDataDb.select();
};


CrystalClusterInfoRecord.prototype.crystalClusterBlockDelete=function(crystalNodeIp,crystalNodePort,interactProtocolType,callback){
   
    DiskDataDb.dbType = 'mysql'; 
    DiskDataDb.mysqlParameter.del.tableName="crystalClusterBlock";
    DiskDataDb.mysqlParameter.del.whereSql="where crystalNodeIp=? and crystalNodePort=? and interactProtocolType=?";
    DiskDataDb.mysqlParameter.del.params=[crystalNodeIp,crystalNodePort,interactProtocolType];
    DiskDataDb.mysqlParameter.del.callBack=function(err,success,affectRowsCount){
        if (err) {
            console.dir(err);  
            callback(false);
        }else
        {
            if(success){
                console.log(success,"--crystalClusterBlock is deleted successfully!");
                callback(true);
            }else{
                callback(false);
            }
        }
    };
    DiskDataDb.del();
}

//unitNodeRelation insert,update,select
CrystalClusterInfoRecord.prototype.unitNodeRelationInsert=function(unitNodeRelation){
    
    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="insert into unitNodeRelation(appId,unitNodeGuid,isActive,createTime,updateTime,unitNodeRelationId,unitNodeRelationGuid,unitNodeRole,unitNodeSource,unitNodeIp,unitNodePort,unitNodeProtocolType,mem_totalHeap,mem_heapUsed,mem_totalForCurrentProcess,mem_totalOnV8EngineUsing,mem_usedMemRate,cpuArch,cpuInfo,freemem,hostName,loadAvg,networkInterface,platformtype,platformVersion,osTempDir,totalMemory,osType,nodeNormalRunedTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    DiskDataDb.mysqlParameter.common.params = [unitNodeRelation.appId,unitNodeRelation.unitNodeGuid,unitNodeRelation.isActive,unitNodeRelation.createTime,unitNodeRelation.updateTime,unitNodeRelation.unitNodeRelationId,unitNodeRelation.unitNodeRelationGuid,unitNodeRelation.unitNodeRole,unitNodeRelation.unitNodeSource,unitNodeRelation.unitNodeIp,unitNodeRelation.unitNodePort,unitNodeRelation.unitNodeProtocolType,unitNodeRelation.mem_totalHeap,unitNodeRelation.mem_heapUsed,unitNodeRelation.mem_totalForCurrentProcess,unitNodeRelation.mem_totalOnV8EngineUsing,unitNodeRelation.mem_usedMemRate,unitNodeRelation.cpuArch,unitNodeRelation.cpuInfo,unitNodeRelation.freemem,unitNodeRelation.hostName,unitNodeRelation.loadAvg,unitNodeRelation.networkInterface,unitNodeRelation.platformtype,unitNodeRelation.platformVersion,unitNodeRelation.osTempDir,unitNodeRelation.totalMemory,unitNodeRelation.osType,unitNodeRelation.nodeNormalRunedTime];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--unitNodeRelation is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    DiskDataDb.add();
};

CrystalClusterInfoRecord.prototype.unitNodeRelationUpdate=function(unitNodeRelation){

    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="update unitNodeRelation set appId=?,isActive=?,createTime=?,updateTime=?,unitNodeRelationId=?,unitNodeRelationGuid=?,unitNodeRole=?,unitNodeSource=?,unitNodeIp=?,unitNodePort=?,unitNodeProtocolType=?,mem_totalHeap=?,mem_heapUsed=?,mem_totalForCurrentProcess=?,mem_totalOnV8EngineUsing=?,mem_usedMemRate=?,cpuArch=?,cpuInfo=?,freemem=?,hostName=?,loadAvg=?,networkInterface=?,platformtype=?,platformVersion=?,osTempDir=?,totalMemory=?,osType=?,nodeNormalRunedTime=? where unitNodeGuid=?";
    DiskDataDb.mysqlParameter.common.params=[unitNodeRelation.appId,unitNodeRelation.isActive,unitNodeRelation.createTime,unitNodeRelation.updateTime,unitNodeRelation.unitNodeRelationId,unitNodeRelation.unitNodeRelationGuid,unitNodeRelation.unitNodeRole,unitNodeRelation.unitNodeSource,unitNodeRelation.unitNodeIp,unitNodeRelation.unitNodePort,unitNodeRelation.unitNodeProtocolType,unitNodeRelation.mem_totalHeap,unitNodeRelation.mem_heapUsed,unitNodeRelation.mem_totalForCurrentProcess,unitNodeRelation.mem_totalOnV8EngineUsing,unitNodeRelation.mem_usedMemRate,unitNodeRelation.cpuArch,unitNodeRelation.cpuInfo,unitNodeRelation.freemem,unitNodeRelation.hostName,unitNodeRelation.loadAvg,unitNodeRelation.networkInterface,unitNodeRelation.platformtype,unitNodeRelation.platformVersion,unitNodeRelation.osTempDir,unitNodeRelation.totalMemory,unitNodeRelation.osType,unitNodeRelation.nodeNormalRunedTime,unitNodeRelation.unitNodeGuid];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--unitNodeRelation is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    DiskDataDb.update();
};

CrystalClusterInfoRecord.prototype.unitNodeRelationSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    DiskDataDb.dbType = 'mysql';    
    DiskDataDb.mysqlParameter.select.tableName='unitNodeRelation';
    DiskDataDb.mysqlParameter.select.topNumber=topNumber;
    DiskDataDb.mysqlParameter.select.whereSql=whereSql;
    DiskDataDb.mysqlParameter.select.params=params;
    DiskDataDb.mysqlParameter.select.orderSql=orderBySql;
    DiskDataDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to unitNodeRelationSelect from current node db');
         if(err)
         {
           console.log('Failed to unitNodeRelationSelect from current node db');  
           callBack(undefined);
         }
         else
         {
           callBack(rows);
           
         }
    };
    DiskDataDb.select();
};

//crystalMasterVote insert,update,select
CrystalClusterInfoRecord.prototype.crystalMasterVoteInsert=function(crystalMasterVote){
    
    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="insert into crystalMasterVote(crystalNodeId,crystalNodeGuid,lastVoteMeNodesIps,lastVotePerformanceDump,lastVoteCount,createTime,updateTime,crystalNodeIp,crystalNodePort,interactProtocolType) values (?,?,?,?,?,?,?,?,?,?)";
    DiskDataDb.mysqlParameter.common.params = [crystalMasterVote.crystalNodeId,crystalMasterVote.crystalNodeGuid,crystalMasterVote.lastVoteMeNodesIps,crystalMasterVote.lastVotePerformanceDump,crystalMasterVote.lastVoteCount,crystalMasterVote.createTime,crystalMasterVote.updateTime,crystalMasterVote.crystalNodeIp,crystalMasterVote.crystalNodePort,crystalMasterVote.interactProtocolType];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--crystalMasterVote is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    DiskDataDb.add();
};

CrystalClusterInfoRecord.prototype.crystalMasterVoteUpdate=function(crystalMasterVote){

    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="update crystalMasterVote set lastVoteMeNodesIps=?,lastVotePerformanceDump=?,lastVoteCount=?,createTime=?,updateTime=?,crystalNodeIp=?,crystalNodePort=?,interactProtocolType=? where crystalNodeGuid=?";
    DiskDataDb.mysqlParameter.common.params = [crystalMasterVote.lastVoteMeNodesIps,crystalMasterVote.lastVotePerformanceDump,crystalMasterVote.lastVoteCount,crystalMasterVote.createTime,crystalMasterVote.updateTime,crystalMasterVote.crystalNodeIp,crystalMasterVote.crystalNodePort,crystalMasterVote.interactProtocolType,crystalMasterVote.crystalNodeGuid];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--crystalMasterVote is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    DiskDataDb.update();
};

CrystalClusterInfoRecord.prototype.crystalMasterVoteClear=function(crystalMasterVote){

    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="update crystalMasterVote set lastVoteCount=?,lastVoteMeNodesIps='' where crystalNodeGuid=?";
    DiskDataDb.mysqlParameter.common.params = [crystalMasterVote.lastVoteCount,crystalMasterVote.crystalNodeGuid];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--crystalMasterVote count is cleared successfully!");
                return true;
            }else{
                console.log(success,"--crystalMasterVote count is cleared failed!");
                return false;
            }
        }
    };
    DiskDataDb.update();
};


CrystalClusterInfoRecord.prototype.crystalMasterVoteSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    DiskDataDb.dbType = 'mysql';    
    DiskDataDb.mysqlParameter.select.tableName='crystalMasterVote';
    DiskDataDb.mysqlParameter.select.topNumber=topNumber;
    DiskDataDb.mysqlParameter.select.whereSql=whereSql;
    DiskDataDb.mysqlParameter.select.params=params;
    DiskDataDb.mysqlParameter.select.orderSql=orderBySql;
    DiskDataDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to crystalMasterVoteSelect from current node db');
         if(err)
         {
            console.log('Failed to crystalMasterVoteSelect from current node db');  
            callBack(undefined);
         }
         else
         {
            callBack(rows);
          
           
         }
    };
    DiskDataDb.select();
};

//customerDbList insert,update,select
CrystalClusterInfoRecord.prototype.customerDbListInsert=function(customerDbList){
    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="insert into customerDbList(guid,dataSourceClassName,dataSourceUser,dataSourcePassword,dataSourceDataBaseName,dataSourcePortNumber,dataSourceServerName,remark,dbTypeNum,isActive,createTime) values (?,?,?,?,?,?,?,?,?,?,?)";
    DiskDataDb.mysqlParameter.common.params = [customerDbList.guid,customerDbList.dataSourceClassName,customerDbList.dataSourceUser,customerDbList.dataSourcePassword,customerDbList.dataSourceDataBaseName,customerDbList.dataSourcePortNumber,customerDbList.dataSourceServerName,customerDbList.remark,customerDbList.dbTypeNum,customerDbList.isActive,customerDbList.createTime];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, insertId) {
      
        if(err)
        {
              console.dir(err);  
              return false;
        }else
        {
          if(insertId!=undefined){
             if(success){
                console.log(success,"--customerDbList is inserted successfully!");
                return true;
             }else{
                return false;
             }
          }

        }
      
    };
    DiskDataDb.add();
};

CrystalClusterInfoRecord.prototype.customerDbListUpdate=function(customerDbList){
    DiskDataDb.dbType = 'mysql';
    DiskDataDb.mysqlParameter.common.sql ="update customerDbList set dataSourceClassName=?,dataSourceUser=?,dataSourcePassword=?,dataSourceDataBaseName=?,dataSourcePortNumber=?,dataSourceServerName=?,remark=?,dbTypeNum=?,isActive=? where guid=?";
    DiskDataDb.mysqlParameter.common.params = [customerDbList.dataSourceClassName,customerDbList.dataSourceUser,customerDbList.dataSourcePassword,customerDbList.dataSourceDataBaseName,customerDbList.dataSourcePortNumber,customerDbList.dataSourceServerName,customerDbList.remark,customerDbList.dbTypeNum,customerDbList.isActive,customerDbList.guid];
    DiskDataDb.mysqlParameter.common.callBack = function (err, success, affectedRows)
    {
        if (err) {
            console.dir(err);  
            return false;
        }else
        {
            if(success){
                console.log(success,"--customerDbList is updated successfully!");
                return true;
            }else{
                return false;
            }
        }
    };
    DiskDataDb.update();
};

CrystalClusterInfoRecord.prototype.customerDbListSelect=function(topNumber,whereSql,params,orderBySql,callBack){
    
    DiskDataDb.dbType = 'mysql';    
    DiskDataDb.mysqlParameter.select.tableName='customerDbList';
    DiskDataDb.mysqlParameter.select.topNumber=topNumber;
    DiskDataDb.mysqlParameter.select.whereSql=whereSql;
    DiskDataDb.mysqlParameter.select.params=params;
    DiskDataDb.mysqlParameter.select.orderSql=orderBySql;
    DiskDataDb.mysqlParameter.select.callBack=function(err, rows)
    {
         console.log('Begin to customerDbListSelect from current node db');
         if(err)
         {
            console.log('Failed to customerDbListSelect from current node db');  
            callBack(undefined);
         }
         else
         {
            callBack(rows);
           
         }
    };
    DiskDataDb.select();
};



module.exports = CrystalClusterInfoRecord;