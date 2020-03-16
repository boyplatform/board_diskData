var os=require('os');
const interfaces=os.networkInterfaces();
const DiskDataHttpHelper=require('./boyDiskDataHttpHelper.js');
var conf = require("./config");
var crpto= require('crypto');
var fs=require("fs");
var nodecmd=require("node-cmd");
var uuid= require('node-uuid'); 
var InodeCahce=require("../coreLibs/iNodeCache");
var memoryNodeCache=new InodeCahce("singleNodeCache");
memoryNodeCache.setConn({});


//初始化当前服务节点公网IP缓存
var initCurrentServerPubIpAdress=function(){

    getCurrentServerPubIpAdress(function(pubIp){});
    require('deasync').sleep(12000);
    //定期执行IP缓存
      setDeamonThreadJob(function(){
          getCurrentServerPubIpAdress(function(pubIp){
            console.log("currentPubIP:",pubIp);
          });
    },conf.platformArch.crystalCluster.SelfPubNetworkIpCacheRetryRateOnceNetError);
}

//获取当前服务节点公网/域内IP
var getCurrentServerIpAdress= function(){
     
      let IPAdress='';
     
          getCurrentServerPubIpAdress(function(pubIp){
              IPAdress=pubIp;
          }); 

          if(IPAdress==="")
          {
                  for(var devName in interfaces)
                  {
                    var iface=interfaces[devName];
                    for(var i=0;i<iface.length;i++){
                        var alias=iface[i];
                        if(alias.family === 'IPv4' && alias.address!=='127.0.0.1'&& !alias.internal){
              
                          IPAdress=alias.address;
                        }
              
                    }
                  }
          }

          if(IPAdress!=='')
          {
            return IPAdress;
        
          }else{
        
            return '127.0.0.1';
          }
           
             
}

//获取当前节点公网IP
var getCurrentServerPubIpAdress= function(callback){
 
     //判断集群网络模式，LAN直接返回''
     if(conf.platformArch.CrystalClusterNetworkMode==="lan"){
        
         return callback("");
       
     }
     //判断缓存中是否已存在pubIp
    
     memoryNodeCache.get("myPubIp",function(err,value){
          if(err){
              console.log(err);
              return callback("");
              
          }
          if (value===undefined||value===null)
          {
             //不存在，请求远程IP查询地址并写入缓存
             DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.CheckSelfPubNetworkIpHttpMode,conf.platformArch.crystalCluster.CheckSelfPubNetworkIpDomainUrl,conf.platformArch.crystalCluster.CheckSelfPubNetworkIpPartialUrl,{},false,conf.platformArch.defaultHttpReqTimeOut,function(res){
                     
                   if(res!=undefined){

                        memoryNodeCache.set("myPubIp",res.ip,{ttl:conf.platformArch.crystalCluster.SelfPubNetworkIpCacheTime},function(err,ok){
                          if(err){
                            console.log("Met error during set myPubIp cache:",err);
                            return callback("");
                           
                          }
                          if(ok==="OK"){
                            
                            console.log("set myPubIp cache successfully.");
                            return callback(res.ip);
                           
                            
                          }

                      })
                   }
                   else{
                          memoryNodeCache.set("myPubIp","",{ttl:conf.platformArch.crystalCluster.SelfPubNetworkIpCacheRetryRateOnceNetError},function(err,ok){
                            if(err){
                              console.log("Met error during set myPubIp cache:",err);
                              return callback("");
                            
                            }
                            if(ok==="OK"){
                              
                              console.log("set myPubIp cache successfully.");
                              return callback("");
                            
                              
                            }

                        })    
                   }

             })    

          }else{
           
             return callback(value);
           
          }  //已存在直接返回
     })
       

       

}


//获取当前服务节点内网IP
var getCurrentServerLocalIpAdress=function(){
    let IPAdress='';
    for(var devName in interfaces){
        var iface=interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias=iface[i];
            if(alias.family === 'IPv4' && alias.address!=='127.0.0.1'&& alias.internal===true){

              IPAdress=alias.address;
            }

        }

    }

    if(IPAdress!=='')
    {
      return IPAdress;

    }else{

      return '127.0.0.1';
    }
}


//设置定时执行的守护线程
var setDeamonThreadJob=function(fun,intervalSeconds){
   setInterval(fun,intervalSeconds*1000,"Deamon Thread was started for function:"+fun.toString());
}

var setDeamonThreadJobWithArgs=function(fun,args,intervalSeconds){
  setInterval(bindInterval(fun,args),intervalSeconds*1000,"Deamon Thread was started for function:"+fun.toString());
}

var setDeamonPromise=function(promiseFun,promiseSeconds){
   
      console.log(promiseFun,' will be executed in '+promiseSeconds+'s later')
      setTimeout(promiseFun,promiseSeconds*1000);
}

function bindInterval(funName){
  var args=[];
  for(var i=1;i<arguments.length;i++){
    args.push(arguments[i]);
  }

  return function(){
    funName.apply(this,args);
  }
}


//获取随机数
var GetRandomNum=function(Min,Max){

     var Range=Max-Min;
     var Rand=Math.random();
     return (Min+Math.round(Rand*Range));

}

//判断当前字符串的存储容量为多少byte
var GetByteAsObj=function(str)
{
     var bf=new Buffer(str);
     return bf.length;
}

//判断当前字符串的存储容量为多少KB
var GetKBAsObj=function(str)
{
    return GetByteAsObj(str)/1024;
}

//判断当前字符串的存储容量为多少MB
var GetMBAsObj=function(str)
{
  return GetKBAsObj(str)/1024;
}

//时间戳转yyyy-MM-dd hh:mm:ss
var GetFormatDateFromTimeSpan=function(timeSpan){
     var date=new Date(timeSpan);
     var year=date.getFullYear();
     var month=date.getMonth()+1;
     var day=date.getDate();
     var hour=date.getHours();
     var minute=date.getMinutes();
     var sec=date.getSeconds();
     month=month<10? "0"+month:month;
     day=day<10? "0"+day:day;
     return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+sec;
}

//生成唯一标识符时加的timespan后缀
var GetUUIDTimeSpan=function(timeSpan){
    var date=new Date(timeSpan);
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    var hour=date.getHours();
    var minute=date.getMinutes();
    var sec=date.getSeconds();
    month=month<10? "0"+month:month;
    day=day<10? "0"+day:day;
    return year+month+day+hour+minute+sec;
}

//对象深拷贝
var deepCloneObject=function(src)
{
       var dest={};
       if(src===null)
       {
         return null;
       }
       for(var key in src){
           if(typeof src ==="object"){
             dest[key]=deepCloneObject(src[key]);
           }else{
             dest[key]=src[key];
           }
       }

      return dest;
}

//获取节点内存
var getCurrentNodeMem=function(){

     var mem=process.memoryUsage();
     var format=function(bytes){

         return (bytes/1024/1024).toFixed(2);
     };//format to MB
     var rs={
         totalHeap:format(mem.heapTotal),
         usedHeap:format(mem.heapUsed),
         totalForCurrentProcess:format(mem.rss),
         totalOnV8EngineUsing:format(mem.external),
         usedMemRate:((format(mem.heapUsed)/format(mem.heapTotal)).toFixed(2))

     };

     return rs;
}

//获取节点OS信息
var getNodeOSInfo=function(){

     var rs={
       cpuArch:os.arch(),
       cpuInfo:os.cpus(),
       freemem:os.freemem(),
       hostName:os.hostname(),
       loadAvg:os.loadavg(),
       networkInterface:os.networkInterfaces(),
       platformtype:os.platform(),
       platformVersion:os.release(),
       osTempDir:os.tmpdir(),
       totalMemory:os.totalmem(),
       osType:os.type(),
       nodeNormalRunedTime:os.uptime()

     };

     return rs;

}

//获取节点电池信息
var getCurrentNodeBattery=function(){
    let battery=Navigator.battery||Navigator.webkitBattery||Navigator.mozBattery;
    var rs={
        isPlugin:battery.charging,
        batteryLevel:battery.level,
        batteryUsedTime:battery.dischargingTime
    };

    return rs;    
}

//获取crystal cluster中所有节点的性能信息
var getCurrentCrystalCluster=async function(resp,httpMode,infoType){
   
   let Rs={};
   
   for(let ip in conf.platformArch.crystalCluster){
        if(whetherCrystalNodeItem(ip))
        {
            var domainUrl=conf.platformArch.crystalCluster[ip];
            var partialUrl="/readMe";
            var qs=""
            var timeout=conf.platformArch.defaultHttpReqTimeOut;
            var body={
                      'type':infoType  
                      };
            let res=await DiskDataHttpHelper.apiSimpleRequest(httpMode,domainUrl,partialUrl,qs,body,timeout);
            Rs[ip]=res;
        }
   }
   //console.log(Rs);
   resp.end(JSON.stringify(Rs));
 
}

//get sha256 by loop count setting
var getSha256=function(inputStr,length){
    
      var shaTimes=conf.platformArch.shaHashTimes;
      var result=null;
      for(var i=0;i<shaTimes;i++){
         if(i===0){  
             result=crpto.createHash('SHA256').update(inputStr).digest('hex');
         }else{
           if(result!=null){
             result=crpto.createHash('SHA256').update(result).digest('hex');
           }
         }
      }

      return result.substr(0,length-1);
}

//write text data to file
var writeTextDataToFile=function(filePath,data,callback){

         fs.writeFile(filePath,data,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
                if(err){
                    
                    console.log(err);
                    callback(err,false);
                }else{

                    console.log("write text data to file successfully.");
                    callback(null,true);
                }

         })

}

//read text data from file
var readTextDataFromFile=function(filePath,callback){
        
    //check whether existed
    fs.exists(filePath,function(exists){     
          
      if(exists){
              fs.stat(filePath,function(error,stats){

                      if(error){
                          console.log(error);
                          callback(error,undefined);
        
                      }else if(stats===undefined||stats.isFile()===false){
                          
                          callback(null,undefined);
                      }else{
        
                          fs.readFile(filePath,'utf-8',function(err,data){
                              
                                if(err){
                                    console.log(err);
                                    callback(err,undefined);
                                    
                                }else{
                                    console.log("read text data from file:",filePath," successfully.");
                                    callback(null,data);
                                }
                  
                  
                          });
                      }
        
                });
          }else
          {
              callback(null,undefined);
          }


    });
}

//read text data from file sync
var readTextDataFromFileSync=function(filePath,callback){

  //check whether existed
    fs.exists(filePath,function(exists){
          
            if(exists){
                      fs.stat(filePath,function(error,stats){

                        if(error){
                            console.log(error);
                            callback(error,undefined);
                        }else if(stats===undefined||stats.isFile()===false){
                            
                            callback(null,undefined);
                        }else{
                
                            fs.readFileSync(filePath,'utf-8',function(err,data){
                                
                                  if(err){
                                      console.log(err);
                                      callback(err,undefined);
                                      
                                  }else{
                                      console.log("read text data from file:",filePath," successfully.");
                                      callback(null,data);
                                  }
                    
                    
                            });
                        }
                
                    });
            }else{
                 callback(null,undefined);
            } 


    });  
    
}

//read buffer data from file
var readBufferDataFromFile=function(filePath,callback){
         
         fs.readFile(filePath,function(err,data){
          
              if(err){
                 console.log(err);
              }else{
                 console.log("read buffer data from file:",filePath," successfully.");
                 callback(data);
              }

         });
}

//delete file
var deleteFile=function(filePath,callback){

      fs.unlink(filePath,function(error){
           if(error){
              console.log(error);
              callback(false);
           }

           callback(true);

      });

}

//getFileKbSize
var getFileKbSize=function(filePath,callback){
 
  let getKb=function(bytes){

    return (bytes/1024).toFixed(2);
  };//getKb from bytes
  fs.exists(filePath,function(exists){
       
        if(exists)
        {
                fs.stat(filePath,function(error,stats){

                  if(error){
                      console.log(error);
                      callback(0);
                  }else if(stats===undefined||stats.isFile()===false){
                      
                      callback(0);
                  }else
                  {
                    callback(getKb(stats.size));
                  }    
        
            });
        }else{
             callback(0);
        }


  });
  
}


//run cmd on current node
var executeCmd=function(cmd,callback){

    nodecmd.get(cmd,function(err,data,stderr){

         if(err){
           console.log(err);
           callback(err);
         }
         if(stderr){
           console.log(stderr);
           callback(stderr);
         }
         callback(data);
    })

}

//get CurrentCluster node count
var getCurrentCrystalClusterNodeCount=function(){
  let crystalClusterNodeCount=0;
  var crystalCluster=conf.platformArch.crystalCluster;
  for(let ip in crystalCluster){
      if(ip.trim()!="httpDefaultMode"&&ip.trim()!="interactProtocolType"&&ip.trim()!="defaultTalkingPort"&&ip.trim()!="crystalTalkingSize"&&ip.trim()!="allowDuplicateOpTalking"&&ip.trim()!="crystalResendTimeout"&&ip.trim()!="definedOperationLogCheckFailedTimes")   //remove non-ip key process
      {
          crystalClusterNodeCount++;
      }
  }
  return crystalClusterNodeCount;
}

//whetherCrystalNodeItem
var whetherCrystalNodeItem=function(inputConfigItem){
  
  if(inputConfigItem.trim()!="httpDefaultMode"&&inputConfigItem.trim()!="interactProtocolType"&&inputConfigItem.trim()!="defaultTalkingPort"&&inputConfigItem.trim()!="crystalTalkingSize"&&inputConfigItem.trim()!="allowDuplicateOpTalking"&&inputConfigItem.trim()!="crystalResendTimeout"&&inputConfigItem.trim()!="definedOperationLogCheckFailedTimes"&&inputConfigItem.trim()!="CheckSelfPubNetworkIpHttpMode"&&inputConfigItem.trim()!="CheckSelfPubNetworkIpDomainUrl"&&inputConfigItem.trim()!="CheckSelfPubNetworkIpPartialUrl"&&inputConfigItem.trim()!="SelfPubNetworkIpCacheTime"&&inputConfigItem.trim()!="CrystalClusterNetworkMode"&&inputConfigItem.trim()!="SelfPubNetworkIpCacheRetryRateOnceNetError")    
  {
      return true;
  }else{
      return false;
  }

}

//get uuid
var getUUID=function(){
   return uuid.v4()+'-'+ GetUUIDTimeSpan(Date.now());
}

//get client IP address
var getClientIP=function(req){
     return req.headers['x-forwarded-for'] || //反代
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
}

//get Map length
var getMapLength=function(mapEntity){

        let length=0;
        for(var key in mapEntity){
           length++;
        }

        return length;

}

//array sort
var arraySort=function(array,key,sortType){

   
    function keySort(key,sortType){
         return function(a,b){
            return sortType ?~~(a[key]<b[key]):~~(a[key]>b[key])
         }
    };

    return array.sort(keySort(key,sortType));
}





exports.initCurrentServerPubIpAdress=initCurrentServerPubIpAdress;
exports.getCurrentServerIpAdress=getCurrentServerIpAdress;
exports.getCurrentServerLocalIpAdress=getCurrentServerLocalIpAdress;
exports.setDeamonThreadJob=setDeamonThreadJob;
exports.GetRandomNum=GetRandomNum;
exports.GetByteAsObj=GetByteAsObj;
exports.GetKBAsObj=GetKBAsObj;
exports.GetMBAsObj=GetMBAsObj;
exports.GetFormatDateFromTimeSpan=GetFormatDateFromTimeSpan;
exports.deepCloneObject=deepCloneObject;
exports.getCurrentNodeMem=getCurrentNodeMem;
exports.getCurrentNodeBattery=getCurrentNodeBattery;
exports.getCurrentCrystalCluster=getCurrentCrystalCluster;
exports.GetUUIDTimeSpan=GetUUIDTimeSpan;
exports.getSha256=getSha256;
exports.writeTextDataToFile=writeTextDataToFile;
exports.readTextDataFromFile=readTextDataFromFile;
exports.readBufferDataFromFile=readBufferDataFromFile;
exports.deleteFile=deleteFile;
exports.executeCmd=executeCmd;
exports.getNodeOSInfo=getNodeOSInfo;
exports.setDeamonThreadJobWithArgs=setDeamonThreadJobWithArgs;
exports.getCurrentCrystalClusterNodeCount=getCurrentCrystalClusterNodeCount;
exports.getUUID=getUUID;
exports.getClientIP=getClientIP;
exports.getMapLength=getMapLength;
exports.arraySort=arraySort;
exports.whetherCrystalNodeItem=whetherCrystalNodeItem;
exports.setDeamonPromise=setDeamonPromise;
exports.readTextDataFromFileSync=readTextDataFromFileSync;
exports.getFileKbSize=getFileKbSize;