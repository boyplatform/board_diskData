'use strict'
function redisCacheShadow(redisCacheGuid,keyObjName,keyObjType,valueSha,createTime,updateTime,value,
    cacheGenMethod,querySqlSha,writeSqlSha,querySql,writeSql,ttl,targetDbName){

        this.redisCacheGuid=redisCacheGuid;
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

redisCacheShadow.prototype={
    constructor: redisCacheShadow,
    getRedisCacheGuid:function(){

        return this.redisCacheGuid;
    },
    getKeyObjName:function(){

        return this.keyObjName;
    },
    getKeyObjType:function(){

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

module.exports = redisCacheShadow;