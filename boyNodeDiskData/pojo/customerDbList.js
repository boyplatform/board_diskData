'use strict'
function customerDbList(guid,dataSourceClassName,dataSourceUser,dataSourcePassword,dataSourceDataBaseName,dataSourcePortNumber,dataSourceServerName,remark,dbTypeNum,isActive,createTime){
    
    this.guid=guid;
    this.dataSourceClassName=dataSourceClassName;
    this.dataSourceUser=dataSourceUser;
    this.dataSourcePassword=dataSourcePassword;
    this.dataSourceDataBaseName=dataSourceDataBaseName;
    this.dataSourcePortNumber=dataSourcePortNumber;
    this.dataSourceServerName=dataSourceServerName;
    this.remark=remark;
    this.dbTypeNum=dbTypeNum;
    this.isActive=isActive;
    this.createTime=createTime;

};

customerDbList.prototype={
    constructor: customerDbList,
    getGuid:function(){

        return this.guid;
    },
    getDataSourceClassName:function(){

        return this.dataSourceClassName;
    },
    getDataSourceUser:function(){

        return this.dataSourceUser;
    },
    getDataSourcePassword:function(){

        return this.dataSourcePassword;
    },
    getDataSourceDataBaseName:function(){

        return this.dataSourceDataBaseName;
    },
    getDataSourcePortNumber:function(){

        return this.dataSourcePortNumber;
    },
    getDataSourceServerName:function(){

        return this.dataSourceServerName;
    },
    getRemark:function(){

        return this.remark;
    },
    getDbTypeNum:function(){

        return this.dbTypeNum;
    },
    getIsActive:function(){

        return this.isActive;
    },
    getCreateTime:function(){
        return this.createTime;
    }
}


module.exports = customerDbList;