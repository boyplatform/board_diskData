'use strict'
var MemCachedPool=require('./memCachedPool');
var RedisPool=require('./redisPool');
var ObjectNodeCache=require('./objectNodeCache');
var LocalFeedCache=require('./localFeedDiskPool');
var RedisClusterPool=require('./redisClusterPool');

function INodeCache(cacheType) {
       this.cacheType=cacheType;
}

INodeCache.prototype.constructor=INodeCache;

//set connection pool
INodeCache.prototype.setConn=function(config){

    switch(this.cacheType){
      case "memCached":
          this.memCachedPool=new MemCachedPool(config);
          break;
      case "redis":
          this.redisPool=new RedisPool(config);
          break;
     case "redisCluster":
          this.redisClusterPool=new RedisClusterPool(config);
          break;
      case "singleNodeCache":
          this.objectNodeCache=new ObjectNodeCache();
          break;
      case "localFeedCache":
          this.localFeedCache=new LocalFeedCache();
          break;
           
      default:
          this.objectNodeCache=new ObjectNodeCache();
         
  }
};



//set
INodeCache.prototype.set=function(key, value, options, callback){
     
    switch(this.cacheType){
        case "memCached":
           this.memCachedPool.set(key,value,options.expire,callback);
           break;
        case "redis":
           this.redisPool.set(key,value,options,callback);
           break;
        case "redisCluster":   
           this.redisClusterPool.set(key,value,options,callback);
           break;
        case "singleNodeCache":
           this.objectNodeCache.set(key,value,options,callback);
           break;
        case "localFeedCache":
           this.localFeedCache.set(key,value,options,callback); 
           break;
        default:
           this.objectNodeCache.set(key,value,options,callback);

    }
   
}

//get
INodeCache.prototype.get=function(key,callback){
    switch(this.cacheType){
      case "memCached":
          this.memCachedPool.get(key,callback);
          break;
      case "redis":
          this.redisPool.get(key,callback);
          break;
      case "redisCluster":
          this.redisClusterPool.get(key,callback);
          break;
      case "singleNodeCache":
          this.objectNodeCache.get(key,callback);
          break;
      case "localFeedCache":
          this.localFeedCache.get(key,callback);
          break;
      default:
          this.objectNodeCache.get(key,callback);
    }
}

//del
INodeCache.prototype.del=function(key,callback){
    switch(this.cacheType){
        case "memCached":
           this.memCachedPool.del(key,callback);
           break;
        case "redis":
           this.redisPool.del(key,callback);
           break;
        case "redisCluster":
           this.redisClusterPool.del(key,callback);
           break;
        case "singleNodeCache":
           this.objectNodeCache.del(key,callback);
           break;
        case "localFeedCache":
           this.localFeedCache.del(key,callback);
           break;
        default:
           this.objectNodeCache.del(key,callback);
      }
}

//pub&sub
INodeCache.prototype.publish=function(channelName,message,callback){
    switch(this.cacheType){
        case "redis":
          this.redisPool.publish(channelName,message,callback);
          break;
        case "redisCluster":
          this.redisClusterPool.publish(channelName,message,callback);
          break;
    }
   
}

INodeCache.prototype.getSubscribeData=function(channelName,messageProcessFun){
    switch(this.cacheType){
        case "redis":
          this.redisPool.getSubscribeData(channelName,messageProcessFun);
          break;
        case "redisCluster":
          this.redisClusterPool.getSubscribeData(channelName,messageProcessFun);
          break;
    }
}

module.exports=INodeCache;