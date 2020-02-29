'use strict'
require('date-utils');
var conf=require("../../../src/config");
var diskDataCommon=require('../../../src/boyDiskDataCommon.js');
var InodeCahce=require("../../../coreLibs/iNodeCache");
var RequestLog=require("../../../pojo/RequestLog");
var DataOperator=require("../../../DataOperator/DataOperator");
const DiskDataHttpHelper=require('../../../src/boyDiskDataHttpHelper');

var OperationLog=require("../../../pojo/operationLog");
var OperationLogSummarySha=require("../../../pojo/operationLogSummarySha");

var DiskDataNodeInfoRecord=require("../../../Dao/DiskDataNodeInfoRecord");
var CrystalClusterInfoRecord=require("../../../Dao/crystalClusterInfoRecord");

function DeamonThreads(){
    
   
    if(conf.redisPoolConfig!==undefined&&conf.redisClusterPoolConfig!==undefined)
    {
        if(conf.platformArch.redisMode==="cluster"){
            this.memoryNodeCache=new InodeCahce("redisCluster");
            this.memoryNodeCache.setConn(conf.redisClusterPoolConfig);
        }else{
            this.memoryNodeCache=new InodeCahce("redis");
            this.memoryNodeCache.setConn(conf.redisPoolConfig);
        }
        this.interact=undefined; 
        this.decideAndAction=undefined;
        this.diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
        
         
    }else{
        console.log("Please finish your redis config");
    }
}
//(0)extract&transfer current node's all operation log to sha.
DeamonThreads.prototype.extractAndTransferOperationLogToSha=function(){

    if(this.decideAndAction!==undefined&&this.decideAndAction.wetherStopGeneralProcess===false)
    {
        this.diskDataNodeInfoRecord.operationLogSelect("","where operationLogTime<?",[diskDataCommon.GetFormatDateFromTimeSpan(Date.now())],"order by operationLogTime desc",function(rows){
                
            let operationRowsShaStr="";
            if(rows!==undefined&&rows.length>0){

                for(let row of rows){

                    operationRowsShaStr=operationRowsShaStr+row.writeSqlSha;
                }

    
                this.diskDataNodeInfoRecord.operationLogSummaryShaSelect("1","where isActive=1",[""],"order by createTime desc",function(rows){
                            
                        if(rows!==undefined&&rows.length<=0){
                        
                            var operationLogSummarySha=new OperationLogSummarySha();
                            operationLogSummarySha.shaCheckGuid=diskDataCommon.getUUID();
                            operationLogSummarySha.createTime=diskDataCommon.GetFormatDateFromTimeSpan(Date.now());
                            operationLogSummarySha.latestCheckOperationSha=diskDataCommon.getSha256(operationRowsShaStr,conf.platformArch.shaHashLengh);
                            this.diskDataNodeInfoRecord.operationLogSummaryShaInsert(operationLogSummarySha);
                
                        }
                }.bind(this))
                
            }

        
        }.bind(this));
    }
}
//(1)send summary sha to current master node
DeamonThreads.prototype.sendSummaryShaToMaster=function(){

    if(this.decideAndAction!==undefined&&this.decideAndAction.wetherStopGeneralProcess===false)
    {
        //loop summary sha out and send it to current master node.
        this.diskDataNodeInfoRecord.operationLogSummaryShaSelect("1","where isActive=1 and isSendToMaster=0",[""],"order by createTime desc",function(rows){

            if(rows!=undefined){
                for(let row of rows)
                {
                    var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                        crystalClusterInfoRecord.crystalClusterBlockSelect("1","where crstalNodeRole=0",[""],"", function(rows2){
                            if(rows2!=undefined)
                            {
                                    let  currentMasterNodeIp=rows2[0].crystalNodeIp;
                                    let  currentMasterNodePort=rows2[0].crystalNodePort;
                                    if(currentMasterNodeIp.trim()!==diskDataCommon.getCurrentServerIpAdress().trim()
                                    ||currentMasterNodeIp.trim()==="127.0.0.1")
                                    {
                                        var domainUrl=currentMasterNodeIp+":"+currentMasterNodePort;
                                        var partialUrl="/crystalTalkingReceiver";
                                        var qs=""
                                        var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                        var body={
                                            'type':'opGetLogSummaryShaFromSubNode',
                                            'shaCheckGuid':row.shaCheckGuid,
                                            'latestCheckOperationSha':row.latestCheckOperationSha,
                                            'createTime':row.createTime,
                                            'isResendReqOrNot':false
                                        };
                                        DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){
                                                    //then wait get confirmation&approve from master via another talking function
                                                    //console.log(res);
                                                    if(res!=null&&res!=undefined&&res.result===true){
                                                        var diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
                                                        diskDataNodeInfoRecord.operationLogSummaryShaUpdateIsSendToMaster(true,row.shaCheckGuid);
                                                    }

                                        });
                                        
                                    }
                            }
                        }.bind(this));    
                }
            }
        }.bind(this));
    
    }
}

//(1.1)If after defined time,also not confirmed and get reject feedback,send summary sha to current master node again.
DeamonThreads.prototype.crystalTalkingSummaryShaConfirmChecker=function(){

    if(this.decideAndAction!==undefined&&this.decideAndAction.wetherStopGeneralProcess===false)
    {
        console.log("crystalTalkingSummaryShaConfirmChecker started");
        //loop all the reqLog under current nodeDB which has been sent to master
        this.diskDataNodeInfoRecord.operationLogSummaryShaSelect("1","where isActive=1 and isSentToMaster=1 and isConfirmedByMaster=0 and notMatchedCount=0",[""],"order by createTime", function(rows){
        
            if(rows!==undefined){
                    for(let row of rows){

                        let whetherResendVerification=false;
                        let now=new Date();
                            let mandantoryActionTime=(row.sendToMasterTime===null? null: new Date(row.sendToMasterTime).clone()); 
                            if(mandantoryActionTime!=null)
                            {
                                mandantoryActionTime.addSeconds(conf.platformArch.crystalCluster.crystalResendTimeout);//Node Db没有queue index Memory中已有队列索引流量整形info时，使用平台强制执行秒数。
                            } 
                        
                            if(now>mandantoryActionTime){
                                whetherResendVerification=true;
                                
                            } 

                            if(whetherResendVerification){

                                    var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                                    crystalClusterInfoRecord.crystalClusterBlockSelect("1","where crstalNodeRole=0",[""],"", function(rows2){
                                        if(rows2!=undefined)
                                        {
                                                let  currentMasterNodeIp=rows2[0].crystalNodeIp;
                                                let  currentMasterNodePort=rows2[0].crystalNodePort;
                                                if(currentMasterNodeIp.trim()!==diskDataCommon.getCurrentServerIpAdress().trim()
                                                ||currentMasterNodeIp.trim()==="127.0.0.1")
                                                {
                                                    var domainUrl=currentMasterNodeIp+":"+currentMasterNodePort;
                                                    var partialUrl="/crystalTalkingReceiver";
                                                    var qs=""
                                                    var timeout=conf.platformArch.defaultHttpReqTimeOut;
                                                    var body={
                                                        'type':'opGetLogSummaryShaFromSubNode',
                                                        'shaCheckGuid':row.shaCheckGuid,
                                                        'latestCheckOperationSha':row.latestCheckOperationSha,
                                                        'createTime':row.createTime,
                                                        'isResendReqOrNot':true
                                                    };
                                                    DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){
                                                                //then wait get confirmation&approve from master via another talking function
                                                                console.log(res);
                                                                if(res!=null&&res!=undefined&&res.result===true){
                                                                    var diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
                                                                    diskDataNodeInfoRecord.operationLogSummaryShaUpdateIsSendToMaster(true,row.shaCheckGuid);
                                                                }
                
                                                    });
                                                    
                                                }
                                        }
                                    }.bind(this));


                            }

                    }
            }

        }.bind(this))
   
    }
}

//(5)Clean the checked sha record timely.
DeamonThreads.prototype.CleanCheckedShaRecord=function(){
    if(this.decideAndAction!==undefined&&this.decideAndAction.wetherStopGeneralProcess===false)
    {
     this.diskDataNodeInfoRecord.checkedOperationLogSummaryShaDelete();
    }
}


module.exports = DeamonThreads;