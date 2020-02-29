'use strict'
function localFeedShadow(localFeedGuid,feedPath,feedName,feedSize,createTime,updateTime,
    keyObjName,feedExtName,keyObjType,valueSha,cacheGenMethod,querySqlSha,
    writeSqlSha,querySql,writeSql,ttl,targetDbName){

        this.localFeedGuid=localFeedGuid;
        this.feedPath=feedPath;
        this.feedName=feedName;
        this.feedSize=feedSize;
        this.createTime=createTime;
        this.updateTime=updateTime;
        this.keyObjName=keyObjName;
        this.feedExtName=feedExtName;
        this.keyObjType=keyObjType;
        this.valueSha=valueSha;
        this.cacheGenMethod=cacheGenMethod;
        this.querySqlSha=querySqlSha;
        this.writeSqlSha=writeSqlSha;
        this.querySql=querySql;
        this.writeSql=writeSql;
        this.ttl=ttl;
        this.targetDbName=targetDbName;

};

localFeedShadow.prototype={
    constructor: localFeedShadow,
    getLocalFeedGuid:function(){

        return this.localFeedGuid;
    },
    getFeedPath:function(){

        return this.feedPath;
    },
    getFeedName:function(){

        return this.feedName;
    },
    getFeedSize:function(){

        return this.feedSize;
    },
    getCreateTime:function(){

        return this.createTime;
    },
    getUpdateTime:function(){

        return this.updateTime;
    },
    getKeyObjName:function(){

        return this.keyObjName;
    },
    getFeedExtName:function(){

        return this.feedExtName;
    },
    getKeyObjType:function(){

        return this.keyObjType;
    },
    getValueSha:function(){

        return this.valueSha;
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


module.exports = localFeedShadow;