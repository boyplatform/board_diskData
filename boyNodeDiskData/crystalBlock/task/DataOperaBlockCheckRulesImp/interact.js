'use strict'
require('date-utils');
var conf=require("../../../src/config");
var diskDataCommon=require('../../../src/boyDiskDataCommon.js');
var InodeCahce=require("../../../coreLibs/iNodeCache");
var RequestLog=require("../../../pojo/RequestLog");
var DataOperator=require("../../../DataOperator/DataOperator");
const DiskDataHttpHelper=require('../../../src/boyDiskDataHttpHelper');

var OperationLog=require("../../../pojo/operationLog");



var DiskDataNodeInfoRecord=require("../../../Dao/DiskDataNodeInfoRecord");
var CrystalClusterInfoRecord=require("../../../Dao/crystalClusterInfoRecord");


function Interact(){
    
   
    if(conf.redisPoolConfig!==undefined&&conf.redisClusterPoolConfig!==undefined)
    {
        if(conf.platformArch.redisMode==="cluster"){
            this.memoryNodeCache=new InodeCahce("redisCluster");
            this.memoryNodeCache.setConn(conf.redisClusterPoolConfig);
        }else{
            this.memoryNodeCache=new InodeCahce("redis");
            this.memoryNodeCache.setConn(conf.redisPoolConfig);
        }
        this.receivedTalkingMessage={};
        this.diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
        this.decideAndAction=undefined;
        
         
    }else{
        console.log("Please finish your redis config");
    }
}


//(2)As a master node, take the cluster sub node summary sha under crystal cluster and verify whether they have same value;if one node not same for times count as conf define,send restore command to the node; if all the same, send correct singnal to related sub node.
Interact.prototype.crystalTalkingMasterReceiveSubSummarySha=function(OperationLogSummarySha){
        
        console.log("crystalTalkingMasterReceiveSubSummarySha started");
        let currentOperationVerificationCube=this.receivedTalkingMessage[diskDataCommon.getSha256(OperationLogSummarySha.shaCheckGuid,conf.platformArch.shaHashLengh)];
        if(currentOperationVerificationCube===undefined||currentOperationVerificationCube.length===0){
            this.receivedTalkingMessage[diskDataCommon.getSha256(OperationLogSummarySha.shaCheckGuid,conf.platformArch.shaHashLengh)]=[OperationLogSummarySha];
            currentOperationVerificationCube=this.receivedTalkingMessage[diskDataCommon.getSha256(OperationLogSummarySha.shaCheckGuid,conf.platformArch.shaHashLengh)];
        }
        //verify whether receivedTalkingMessage's count is smaller than crystal cluster node count-1
        if(currentOperationVerificationCube.length<(diskDataCommon.getCurrentCrystalClusterNodeCount()-1))
        {
            let duplicateIpCount=0;
            for(let item of currentOperationVerificationCube){
                if(item.comeFromCrystalNodeIp===OperationLogSummarySha.comeFromCrystalNodeIp){
                    duplicateIpCount++;
                }
            }
            if(duplicateIpCount===0){
            //if not put remote OperationLogSummarySha into the receivedTalkingMessage
            this.receivedTalkingMessage[diskDataCommon.getSha256(OperationLogSummarySha.shaCheckGuid,conf.platformArch.shaHashLengh)].push(OperationLogSummarySha);
            return JSON.stringify({result:true,desc:"OperationLogSummarySha was pushed into master node for verification successfully."});
            }else{
            return JSON.stringify({result:false,desc:"OperationLogSummarySha was pushed into master node for verification failed."});
            }

        }else{
            return JSON.stringify({result:false,desc:"OperationLogSummarySha was pushed into master node for verification failed."});
        } 
}


//(3)As a work sub node, recevie summary sha  master verification result and save it to current node DB and verify whether need trigger the restore flag.
Interact.prototype.crystalTalkingSubReceiveMasterSummaryShaVerificationResult=function(OperationLogSummarySha){
   
    if(this.decideAndAction!==undefined&&this.decideAndAction.wetherStopGeneralProcess===false)
    {
            //Once work sub node receive the result,verify whether need to update notMatchedCount
            if(OperationLogSummarySha.isConfirmedByMaster){

                this.diskDataNodeInfoRecord.operationLogSummaryShaUpdateIsConfirmedByMaster(OperationLogSummarySha.shaCheckGuid,true,OperationLogSummarySha.comeFromCrystalNodeIp);
                return JSON.stringify({result:true,desc:"sub node get master node summary operation-sha confirmation successfully."});
            }else{
                //notMatchedCount++
                this.diskDataNodeInfoRecord.operationLogSummaryShaUpdateNotMatchedCount(OperationLogSummarySha.shaCheckGuid,function(result){
                
                    if(result){
                        //if notMatchedCount=definedOperationLogCheckFailedTimes, update isNeedRestore=1
                        this.diskDataNodeInfoRecord.operationLogSummaryShaUpdateIsNeedRestore(OperationLogSummarySha.shaCheckGuid,conf.platformArch.crystalCluster.definedOperationLogCheckFailedTimes);
                        return JSON.stringify({result:true,desc:"sub node get master node summary operation-sha confirmation failed once."});
                    }

                }.bind(this))
                
            }
    }
   
}
   

//(3.1)As a work sub node, export operation log list to other crystal cluster nodes by given check timepoint.
Interact.prototype.exportOperationLog=function(checkTimePoint,callback){

    if(this.decideAndAction!==undefined&&this.decideAndAction.wetherStopGeneralProcess===false){
          
        this.diskDataNodeInfoRecord.operationLogSelect("","where operationLogTime<?",[checkTimePoint],"",function(rows){

               callback(rows);
        });
    }else{
           callback([]);
    }
}

module.exports = Interact;