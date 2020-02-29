'use strict'
var Memcached = require('memcached');
var poolModule = require('generic-pool');
 
function MemcachedPool(config) {
     
    this.setPool(config);
   
};

MemcachedPool.prototype.constructor=MemcachedPool;

MemcachedPool.prototype.setPool = function(config) {

    console.log("init pool for memcached start..");
    this.pool= poolModule.Pool({
        name : 'memcached',
        create : function(callback){
             
           var memcached = new Memcached(config.host, {debug: true});
            memcached.on("failure", function (detail) {console.log(detail);})
                     .on('connect', function (detail) {console.log(detail);})
                     .on('reconnect', function (detail) {console.log(detail);})
                     .on('reconnecting', function (detail) {console.log(detail);})
                     .on('remove', function (detail) {console.log(detail);})
                     .on('issue', function (detail) {console.log(detail);});
            callback(null, memcached);
        },
        destory : function(client){
            if(client.connected){
                try{
                    client.end();
                }
                catch(err){
                    console.log('Failed to memcached connection: ' + err);
                }
            }
        },
        max : config.connectionLimit,
        idleTimeoutMillis : config.timeout,
        log : false
    });

    console.log("init pool for memcached end....");
};

MemcachedPool.prototype.set= function(key, val, expire, callback){
	this.pool.acquire(function(err, client){
		if(err){
            callback(err,null);
            return;
        }
        if(!expire) {expire = 172800;}else{expire=expire*1000}
        client.set(key, val, expire, function(err, data){
        	pool.release(client);
            if(err){
                callback(err, null);
                return;
            }
            callback(err, data);
        });
	});
};

MemcachedPool.prototype.get = function(key, callback){
	pool.acquire(function(err, client){
		if(err){
            callback(err,null);
            return;
        }
        client.get(key, function(err, data){
        	pool.release(client);
            if(err){
                callback(err, null);
                return;
            }
            callback(err, data);
        });
	});
};

MemcachedPool.prototype.del = function(key, callback){
	pool.acquire(function(err, client){
		if(err){
            callback(err);
            return;
        }
        client.del(key, function(err, data){
        	pool.release(client);
            if(err){
                callback(err, null);
                return;
            }
            callback(err, data);
        });
	});
};

module.exports = MemcachedPool;
