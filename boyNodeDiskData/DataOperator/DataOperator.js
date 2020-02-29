'use strict'
var conf=require("../src/config");
var DiskDataDbHelper= require("../Dao/boyDiskDataDBHelper");
 

function DataOperator(){
    this.DiskDataDb=new DiskDataDbHelper();
}

//execute write sql
DataOperator.prototype.executeWrite=function(sqlstatement,callBack){
    
    
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.sql =sqlstatement;
    this.DiskDataDb.mysqlParameter.common.params=[""];
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.diskDataDBConf;
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
    this.DiskDataDb.querySql();
}

//execute query sql
DataOperator.prototype.executeQuery=function(querySqlStatement,callBack){
    
    this.DiskDataDb.dbType = 'mysql';
    this.DiskDataDb.mysqlParameter.common.sql =querySqlStatement;
    this.DiskDataDb.mysqlParameter.common.params=[""];
    this.DiskDataDb.mysqlParameter.common.dbConf=conf.diskDataDBConf;
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

module.exports=DataOperator;