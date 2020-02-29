'use strict'
var redis = require('ioredis');
var poolModule = require('generic-pool');
var pool=undefined;
 
function RedisClusterPool(config) {
     if(pool===undefined){
          pool = poolModule.createPool(
            {
              create   : function() {
               try{
                    
                    this.createRedisClusterClient(config)
                   
                    return this.client;
                }catch(err){
                  if (err) {
                    console.log(err);
                    return;
                  }
                }
              }.bind(RedisClusterPool.prototype),
              destroy  : function(client) {
                  client.quit();
              }
          },
            { max     : 100,
              min      : 5,
              idleTimeoutMillis : 30000,
              log      : false
            }
          );
          
    }

}

RedisClusterPool.prototype.constructor=RedisClusterPool;

RedisClusterPool.prototype.createRedisClusterClient=function(config){
  try{
    this.client = new redis.Cluster(config);
    
  }catch(err){
    console.log(err);
    this.client=undefined;
  }
  
};



RedisClusterPool.prototype.set = function(key, value, options, callback) {

  let clientShadow=undefined;
  pool.acquire().then(function(client){
        clientShadow=client;
        client.set(key, value, (err, ok) => {
          if (err) {
            pool.release(client);
            callback(err);
            return;
          }
          options.hasOwnProperty("ttl") ? client.expire(key, options.ttl): 0;
          pool.release(client);
          return callback(null, ok);
      });
  }).catch(function(err){

      if (err) {
        pool.release(clientShadow);
        callback(err);
        return;
      }

  });
 
};

RedisClusterPool.prototype.get = function(key, callback) {

  let clientShadow=undefined;
     pool.acquire().then(function(client){
        clientShadow=client;
        client.get(key, (err, value) => {
          if (err) {
            pool.release(client);
            callback(err,null);
            return;
          }
          pool.release(client);
          return callback(null, value);
        });
     }).catch(function(err){
        if (err) {
          pool.release(clientShadow);
          callback(err,null);
          return;
        }
     });
 
};

RedisClusterPool.prototype.del = function(key, callback) {
  let clientShadow=undefined;
   pool.acquire().then(function(client){
      clientShadow=client;
      client.del(key, (err, value) => {
        if (err) {
          pool.release(client);
          callback(err);
          return;
        }

        pool.release(client);
        return callback(null, value);
      });
   }).catch(function(err){
        if(err) {
          pool.release(clientShadow);
          callback(err);
          return;
        }
   });
 
};

//pub&sub
RedisClusterPool.prototype.publish=function(channelName,message,callback){
  let clientShadow=undefined;
  pool.acquire().then(function(client){
        clientShadow=client;
        client.publish(channelName,message);
        pool.release(client);
        callback(true);
  }).catch(function(err){
      if(err) {
        pool.release(clientShadow);
        callback(err);
        return;
      }
  });

};

RedisClusterPool.prototype.getSubscribeData=function(channelName,messageProcessFun){
   let clientShadow=undefined;
   pool.acquire().then(function(client){
        clientShadow=client;
        client.on("ready",function(){
            client.subscribe(channelName);
            console.log("subscribe to "+channelName+" successfully.");
        }); 
        
        client.on("error",function(error){

            pool.release(client);
            console.log("Redis Error:"+error);
        });
        
        client.on("subscribe",function(channel,count){
                        
            console.log("client subscribed to ",channel,",",count," total subscriptions.");   
        });

        client.on("message",function(channel,message){
          
            console.log("Current received message:",message," under channel ",channel);
            messageProcessFun(message);

        });
        
        client.on("unsubscribe",function(channel,count){
          
            pool.release(client);
            console.log("Client unsubscribed from ",channel,",",count," total subscriptions.");
        });

  }).catch(function(err){
        if(err) {
          pool.release(clientShadow);
          callback(err);
          return;
        }
  });

};

module.exports = RedisClusterPool;