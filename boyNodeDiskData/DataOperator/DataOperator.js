'use strict'
var conf=require("../src/config");
var DiskDataDbHelper= require("../Dao/boyDiskDataDBHelper");
 

function DataOperator(){
    this.DiskDataDb=new DiskDataDbHelper();
}

//execute write sql
DataOperator.prototype.executeWrite=function(sqlstatement,callBack,reqStorageClusterType){
    
    if(reqStorageClusterType.toString()==='0'){
        
        this.DiskDataDb.dbType = 'mysql';
        this.DiskDataDb.mysqlParameter.common.dbConf=conf.diskDataDBConf;
        this.DiskDataDb.mysqlParameter.common.sql =sqlstatement;
        this.DiskDataDb.mysqlParameter.common.params=[""];
        this.DiskDataDb.mysqlParameter.common.callBack = function (err, res) {
    
            if(err)
            {
                console.dir(err);  
                callBack(false);
            }else
            {
                console.log(res);
                callBack(res);

            }
        
        };

    }else if(reqStorageClusterType.toString()==='1')
    {
        this.DiskDataDb.dbType = 'mssql';
        this.DiskDataDb.mssqlParameter.common.dbConf=conf.diskDataDBConf_Mssql;
        this.DiskDataDb.mssqlParameter.common.sql =sqlstatement;
        this.DiskDataDb.mssqlParameter.common.params="";
        this.DiskDataDb.mssqlParameter.common.callBack = function (err, res) {
    
            if(err)
            {
                console.dir(err);  
                callBack(false);
            }else
            {
                console.log(res);
                callBack(res);

            }
        
        };
    }
    
    
    this.DiskDataDb.querySql();
}

//execute query sql
DataOperator.prototype.executeQuery=function(querySqlStatement,callBack,reqStorageClusterType){
    
    if(reqStorageClusterType.toString()==='0'){
        
        this.DiskDataDb.dbType = 'mysql';
        this.DiskDataDb.mysqlParameter.common.dbConf=conf.diskDataDBConf;
        this.DiskDataDb.mysqlParameter.common.sql =querySqlStatement;
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

    }else if(reqStorageClusterType.toString()==='1')
    {
        this.DiskDataDb.dbType = 'mssql';
        this.DiskDataDb.mssqlParameter.common.dbConf=conf.diskDataDBConf_Mssql;
        this.DiskDataDb.mssqlParameter.common.sql =querySqlStatement;
        this.DiskDataDb.mssqlParameter.common.params="";
        this.DiskDataDb.mssqlParameter.common.callBack = function (err, result) {
    
            if(err)
            {
                console.dir(err);  
                callBack(undefined);
            }else
            {
                callBack(result.recordset);

            }
        
        };
    }
    
    this.DiskDataDb.querySql();

}

module.exports=DataOperator;