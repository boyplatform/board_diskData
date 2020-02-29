'use strict'
var path=require("path");
var diskDataCommon=require('../src/boyDiskDataCommon.js');


function LocalFeedDiskPool(localFeedPath) {
   
    if(localFeedPath===""){
        this.localFeedPath="../localFeeds/";
    }else{
        this.localFeedPath=localFeedPath;
    }
}

//set
LocalFeedDiskPool.prototype.set = function(key, value, options, callback) {

    diskDataCommon.writeTextDataToFile(path.join(this.localFeedPath,key+".txt"),value,function(err,result){
 
           if(result){
                // Set TTL
                if (options.ttl) {
                    setTimeout(() => {
                        diskDataCommon.deleteFile(path.join(this.localFeedPath,key+".txt"),function(result){
                           
                            if(result){
                                console.log("One local feed disk-cache-file:",path.join(this.localFeedPath,key+".txt")," has been removed successfully.");
                            }    
                        });
                    }, options.ttl*1000)
                }
                return callback(null,true);
           }else{
                return callback(err,false);
           }

    });

};


//get
LocalFeedDiskPool.prototype.get=function(key, callback) {
    
    diskDataCommon.readTextDataFromFile(paht.join(this.localFeedPath,key+".txt"),function(err,data){
         
        if(data!=false){
            console.log("get data from one local feed disk-cache-file:",path.join(this.localFeedPath,key+".txt")," once successfully.");
            callback(null,data);
        }else{

            console.log("get data from one local feed disk-cache-file:",path.join(this.localFeedPath,key+".txt")," once failed.");
            callback(err,null);
        }

    });
};


//del
LocalFeedDiskPool.prototype.del=function(key, callback) {
    
    diskDataCommon.deleteFile(paht.join(this.localFeedPath,key+".txt"),function(result){
         
          if(result){
               console.log("delete one local feed disk-cache-file:",path.join(this.localFeedPath,key+".txt"," successfully."));
               callback(result);
          }else{
               console.log("delete one local feed disk-cache-file:",path.join(this.localFeedPath,key+".txt"," failed."));
               callback(result);
          }
       
    });
};



module.exports=LocalFeedDiskPool;


