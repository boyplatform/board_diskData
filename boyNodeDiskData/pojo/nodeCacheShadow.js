'use strict'
function nodeCacheShadow(nodeCacheGuid,keyObjName,keyObjType,valueSha,createTime,updateTime,
    value,cacheGenMethod,querySqlSha,writeSqlSha,querySql,writeSql,ttl,targetDbName){

        this.nodeCacheGuid=nodeCacheGuid;
        this.keyObjName=keyObjName;
        this.keyObjType=keyObjType;
        this.valueSha=valueSha;
        this.createTime=createTime;
        this.updateTime=updateTime;
        this.value=value;
        this.cacheGenMethod=cacheGenMethod;
        this.querySqlSha=querySqlSha;
        this.writeSqlSha=writeSqlSha;
        this.querySql=querySql;
        this.writeSql=writeSql;
        this.ttl=ttl;
        this.targetDbName=targetDbName;
}

nodeCacheShadow.prototype={
    constructor: nodeCacheShadow,
    getNodeCacheGuid:function(){

        return this.nodeCacheGuid;
    },
    getKeyObjName:function(){

        return this.keyObjName;
    },
    getkeyObjType:function(){

        return this.keyObjType;
    },
    getValueSha:function(){
        return this.valueSha;
    },
    getCreateTime:function(){
        return this.createTime;
    },
    getUpdateTime:function(){
        return this.updateTime;
    },
    getValue:function(){
        return this.value;
    },
    getCacheGenMethod:function(){
        return this.cacheGenMethod;
    },
    getQuerySqlSha:function(){
        return this.querySqlSha;
    },
    getWriteSqlSha:function(){
        return this.writeSqlSha;
    },
    getQuerySql:function(){
        return this.querySql;
    },
    getWriteSql:function(){
        return this.writeSql;
    },
    getTtl:function(){
        return this.ttl;
    },
    getTargetDbName:function(){
        return this.targetDbName;
    }
};

module.exports = nodeCacheShadow;