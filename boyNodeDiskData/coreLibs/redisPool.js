'use strict'
var redis = require('redis');
var poolModule = require('generic-pool');
var pool=undefined;
 
function RedisPool(config) {
     if(pool===undefined){
          pool = poolModule.createPool(
            {
              create   : function() {
              
                if(config.url!=undefined){
                    this.connect(config)
                  }else{
                    this.connectWithFullConfig(config)
                  }

                return this.client;
              }.bind(RedisPool.prototype),
              destroy  : function(client) {
                  client.quit();
              }
          },
            {max     : 100,
            min      : 5,
            idleTimeoutMillis : 30000,
            log      : false
            }
          );
    }

}

RedisPool.prototype.constructor=RedisPool;

RedisPool.prototype.connectWithFullConfig=function(config){
  
  this.client = redis.createClient(config.port,config.host,config.opts);
   
  

};

RedisPool.prototype.connect = function(config) {
  
  this.client = redis.createClient(config.url);
   
};

RedisPool.prototype.set = function(key, value, options, callback) {

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

RedisPool.prototype.get = function(key, callback) {

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

RedisPool.prototype.del = function(key, callback) {
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
RedisPool.prototype.publish=function(channelName,message,callback){
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

RedisPool.prototype.getSubscribeData=function(channelName,messageProcessFun){
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

module.exports = RedisPool;