'use strict'
var Promise=require("bluebird")
var conf=require("../../../src/config");
const DiskDataHttpHelper=require('../../../src/boyDiskDataHttpHelper')
var diskDataCommon=require('../../../src/boyDiskDataCommon');
var CrystalClusterInfoRecord=require("../../../Dao/crystalClusterInfoRecord")
var CrystalClusterBlock=require('../../../pojo/crystalClusterBlock');
var CrystalMasterVote=require('../../../pojo/crystalMasterVote');

function DeamonThreads(){
    
    if(this.crystalClusterInfoRecord===undefined){
        this.crystalClusterInfoRecord=new CrystalClusterInfoRecord();
     }
     if(this.crystalMasterVote===undefined){
        this.crystalMasterVote=new CrystalMasterVote();
     }
     this.nodeRoleRs=undefined;
 
};

DeamonThreads.prototype.constructor=DeamonThreads;

//Crystal cluster node performance collection
DeamonThreads.prototype.nodePerformanceCollect=async function(httpMode){
    
    console.log("start crystal cluster node performance collection")
    if(this.crystalClusterInfoRecord===undefined){
        this.crystalClusterInfoRecord=new CrystalClusterInfoRecord();
     }
     if(this.crystalMasterVote===undefined){
        this.crystalMasterVote=new CrystalMasterVote();
     }
     
    let Rs={};
    var crystalCluster=conf.platformArch.crystalCluster;
    //loop the crystal cluster IP which not equal to current node IP.
    for(let ip in crystalCluster){
       
        if(diskDataCommon.whetherCrystalNodeItem(ip.trim()))   //remove non-ip key process
        {
            let crystalNodeIp=null,crystalNodePort=null;
            if(crystalCluster[ip].split(":").length>1){

                crystalNodeIp=crystalCluster[ip].split(":")[0];
                crystalNodePort=crystalCluster[ip].split(":")[1];
            }else{
                crystalNodeIp=crystalCluster[ip];
                crystalNodePort=80;
            }
            
           // if(crystalNodeIp.trim()!==diskDataCommon.getCurrentServerIpAdress().trim()
           // ||crystalNodeIp.trim()==="127.0.0.1"){
                    //seek the crystal IPs' node performance info out and save them into current node DB.
                    var domainUrl=crystalNodeIp+":"+crystalNodePort;
                    var partialUrl="/readMe";
                    var qs=""
                    var timeout=conf.platformArch.defaultHttpReqTimeOut;
                    var body={
                        'type':'mem'  
                    };
                    let res=await DiskDataHttpHelper.apiSimpleRequest(httpMode,domainUrl,partialUrl,qs,body,timeout);

                    body={
                        'type':'osInfo'  
                        };
                    let res2=await DiskDataHttpHelper.apiSimpleRequest(httpMode,domainUrl,partialUrl,qs,body,timeout);
                
                    for(var key in res2){
                        if(res2[key]!=undefined){
                          res[key]=res2[key];
                        }
                    }

                   // console.log(res);
    
                //save Performance record
                this.crystalClusterInfoRecord.crystalClusterBlockSelect("","where crystalNodeIp=? and crystalNodePort=? and interactProtocolType=?",[crystalNodeIp,crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType],"",function(rows){
                    
                    if(res!=undefined&&rows!=undefined){
                        if(rows.length>0){
                                var crystalClusterBlock=  new CrystalClusterBlock(rows[0].crystalNodeGuid,rows[0].crystalNodeIp,rows[0].crystalNodePort,rows[0].interactProtocolType
                                ,res["totalHeap"],res["usedHeap"],res["totalForCurrentProcess"],res["totalOnV8EngineUsing"],res["usedMemRate"],res["cpuArch"],JSON.stringify(res["cpuInfo"]),res["freemem"],res["hostName"]
                                ,JSON.stringify(res["loadAvg"]),JSON.stringify(res["networkInterface"]),res["platformtype"],res["platformVersion"],res["osTempDir"],res["totalMemory"],res["osType"],res["nodeNormalRunedTime"],1);
                        
                                var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                                crystalClusterInfoRecord.crystalClusterBlockUpdate(crystalClusterBlock);  

                        }else{
                            
                                var crystalClusterBlock=  new CrystalClusterBlock(diskDataCommon.getUUID(),crystalNodeIp,crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType
                                ,res["totalHeap"],res["usedHeap"],res["totalForCurrentProcess"],res["totalOnV8EngineUsing"],res["usedMemRate"],res["cpuArch"],JSON.stringify(res["cpuInfo"]),res["freemem"],res["hostName"]
                                ,JSON.stringify(res["loadAvg"]),JSON.stringify(res["networkInterface"]),res["platformtype"],res["platformVersion"],res["osTempDir"],res["totalMemory"],res["osType"],res["nodeNormalRunedTime"],1);
                        
                                var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                                crystalClusterInfoRecord.crystalClusterBlockInsert(crystalClusterBlock);  
                        }
                    }


                });
                 
                
               
                Rs[crystalNodeIp+":"+crystalNodePort]=res;     
            //}
        }     
     }

    return Rs;
};

//Crystal cluster master timely self nature selection/vote
DeamonThreads.prototype.timelySelfNatureSelectionVote=function(){
   
    console.log("start timelySelfNatureSelectionVote")
    if(this.crystalClusterInfoRecord===undefined){
        this.crystalClusterInfoRecord=new CrystalClusterInfoRecord();
     }
     if(this.crystalMasterVote===undefined){
        this.crystalMasterVote=new CrystalMasterVote();
     }
    //Get crystal cluster node number dymatically
    let crystalClusterNodeCount=0;
    var crystalCluster=conf.platformArch.crystalCluster;
    for(let ip in crystalCluster){
        if(diskDataCommon.whetherCrystalNodeItem(ip.trim()))   //remove non-ip key process
        {
            crystalClusterNodeCount++;
        }
    }
    //Base on collected node performance info,select self preferred master node and do the vote on current nodeDB.
     this.crystalClusterInfoRecord.crystalClusterBlockSelect("","where crystalNodeId>0 and crystalNodeIp<>?",[diskDataCommon.getCurrentServerIpAdress().trim()],"",function(rows){

          if(rows!==undefined)
          { 
                SelfNatureSelectionVote(rows,function(masterNodeRow){

                    //record the SelfNatureSelectionVote to current nodeDB
                    //if existed, update it, if not existed, insert new
                        if(masterNodeRow!=undefined&&masterNodeRow!=null)
                        {   
                                setTimeout(function(){
                                    console.log("sleep done");
                                },3);
                                var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                               
                                crystalClusterInfoRecord.crystalMasterVoteSelect("1","where crystalNodeId=? and crystalNodeGuid=?",[masterNodeRow.crystalNodeId,masterNodeRow.crystalNodeGuid.trim()],"",function(rows2){

                                
                                    return new Promise(function(resolve,reject){
                                        
                                            if(rows2!==undefined&&typeof(rows2.length)==="number"){
                                                resolve(rows2);
                                            }else{
                                                reject(rows2);
                                            }

                                    }).then(function(rows2){
                                            
                                            if(rows2.length>0){
                                                var crystalMasterVote=new CrystalMasterVote(rows2[0].crystalNodeId,rows2[0].crystalNodeGuid,rows2[0].lastVoteMeNodesIps.indexOf(diskDataCommon.getCurrentServerIpAdress().trim())<0? rows2[0].lastVoteMeNodesIps+";"+diskDataCommon.getCurrentServerIpAdress().trim():rows2[0].lastVoteMeNodesIps,
                                                JSON.stringify({mem_totalHeap:masterNodeRow.mem_totalHeap,mem_heapUsed:masterNodeRow.mem_heapUsed,mem_usedMemRate:masterNodeRow.mem_usedMemRate,freemem:masterNodeRow.freemem,loadAvg:masterNodeRow.loadAvg}),rows2[0].lastVoteCount+1,
                                                rows2[0].createTime,rows2[0].crystalNodeIp,rows2[0].crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType);
                                                crystalClusterInfoRecord.crystalMasterVoteUpdate(crystalMasterVote);
                                            }else{
                                                var crystalMasterVote=new CrystalMasterVote(masterNodeRow.crystalNodeId,masterNodeRow.crystalNodeGuid.trim(),diskDataCommon.getCurrentServerIpAdress().trim(),
                                                JSON.stringify({mem_totalHeap:masterNodeRow.mem_totalHeap,mem_heapUsed:masterNodeRow.mem_heapUsed,mem_usedMemRate:masterNodeRow.mem_usedMemRate,freemem:masterNodeRow.freemem,loadAvg:masterNodeRow.loadAvg}),1,
                                                diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),masterNodeRow.crystalNodeIp,masterNodeRow.crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType);
                                                crystalClusterInfoRecord.crystalMasterVoteInsert(crystalMasterVote);
                                            }
                                    },function(err){
                                        
                                        if(err){

                                            console.log("met error on crystalMasterVote processing...,the error row data is:",err);
                                        }
                                        
                                    }).catch(function(err){
                                             console.log("met fatal error on crystalMasterVote processing...,the error is:",err);
                                            
                                    });
                                 /*if(rows2!==undefined)
                                    {
                                    
                                        if(rows2.length>0){
                                            var crystalMasterVote=new CrystalMasterVote(rows2[0].crystalNodeId,rows2[0].crystalNodeGuid,rows2[0].lastVoteMeNodesIps.indexOf(diskDataCommon.getCurrentServerIpAdress().trim())<0? rows2[0].lastVoteMeNodesIps+";"+diskDataCommon.getCurrentServerIpAdress().trim():rows2[0].lastVoteMeNodesIps,
                                            JSON.stringify({mem_totalHeap:masterNodeRow.mem_totalHeap,mem_heapUsed:masterNodeRow.mem_heapUsed,mem_usedMemRate:masterNodeRow.mem_usedMemRate,freemem:masterNodeRow.freemem,loadAvg:masterNodeRow.loadAvg}),rows2[0].lastVoteCount+1,
                                            rows2[0].createTime,rows2[0].crystalNodeIp,rows2[0].crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType);
                                            crystalClusterInfoRecord.crystalMasterVoteUpdate(crystalMasterVote);

                                        }else if(rows2.length<=0){
                                            var crystalMasterVote=new CrystalMasterVote(masterNodeRow.crystalNodeId,masterNodeRow.crystalNodeGuid.trim(),diskDataCommon.getCurrentServerIpAdress().trim(),
                                            JSON.stringify({mem_totalHeap:masterNodeRow.mem_totalHeap,mem_heapUsed:masterNodeRow.mem_heapUsed,mem_usedMemRate:masterNodeRow.mem_usedMemRate,freemem:masterNodeRow.freemem,loadAvg:masterNodeRow.loadAvg}),1,
                                            diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),masterNodeRow.crystalNodeIp,masterNodeRow.crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType);
                                            crystalClusterInfoRecord.crystalMasterVoteInsert(crystalMasterVote);
                                        }
                                        
                                } */
                                });
                        }


                });

          }
       

     });

     function SelfNatureSelectionVote(rows,callback){
        
            if(rows.length===crystalClusterNodeCount-1){
                //declare vote weight map
                let lastBestHitCrystalNodeCube={
                    lastMem_totalHeapCrystalNodeGuid:"",
                    lastMem_heapUsedCrystalNodeGuid:"",
                    lastMem_usedMemRateCrystalNodeGuid:"",
                    lastFreememCrystalNodeGuid:"",
                    lastLoadAvg1CrystalNodeGuid:"",
                    lastLoadAvg5CrystalNodeGuid:"",
                    lastLoadAvg15CrystalNodeGuid:""
                   };
                let voteMap={};
                for(let row of rows){
                  
                   voteMap[row.crystalNodeGuid]={mem_totalHeap_weight:0,mem_heapUsed_weight:0,mem_usedMemRate_weight:0,
                    freemem_weight:0,loadAvg1_weight:0,loadAvg5_weight:0,loadAvg15_weight:0};
                }
                
                
                let max_mem_totalHeapTemp=0;
                let min_mem_heapUsedTemp=diskDataCommon.getCurrentNodeMem().usedHeap;  
                let min_mem_usedMemRateTemp=diskDataCommon.getCurrentNodeMem().usedMemRate;
                let max_freememTemp=0;
                let min_loadAvg1Temp=diskDataCommon.getNodeOSInfo().loadAvg[0];
                let min_loadAvg5Temp=diskDataCommon.getNodeOSInfo().loadAvg[1];
                let min_loadAvg15Temp=diskDataCommon.getNodeOSInfo().loadAvg[2];

                for(let row of rows){

                    //take max mem_totalHeap
                    if(row.mem_totalHeap>max_mem_totalHeapTemp&&row.crystalNodeGuid!=lastBestHitCrystalNodeCube.lastMem_totalHeapCrystalNodeGuid)
                    {
                        if(lastBestHitCrystalNodeCube.lastMem_totalHeapCrystalNodeGuid!=""){
                            voteMap[lastBestHitCrystalNodeCube.lastMem_totalHeapCrystalNodeGuid].mem_totalHeap_weight--;
                        }
                        voteMap[row.crystalNodeGuid].mem_totalHeap_weight++;
                        lastBestHitCrystalNodeCube.lastMem_totalHeapCrystalNodeGuid=row.crystalNodeGuid;
                        max_mem_totalHeapTemp=row.mem_totalHeap;
                    }
                    //take min mem_heapUsed
                    if(row.mem_heapUsed<min_mem_heapUsedTemp&&row.crystalNodeGuid!=lastBestHitCrystalNodeCube.lastMem_heapUsedCrystalNodeGuid){
                        
                        if(lastBestHitCrystalNodeCube.lastMem_heapUsedCrystalNodeGuid!=""){
                            voteMap[lastBestHitCrystalNodeCube.lastMem_heapUsedCrystalNodeGuid].mem_heapUsed_weight--;
                        }
                        voteMap[row.crystalNodeGuid].mem_heapUsed_weight++;
                        lastBestHitCrystalNodeCube.lastMem_heapUsedCrystalNodeGuid=row.crystalNodeGuid;
                        min_mem_heapUsedTemp=row.mem_heapUsed;
                    }
                    //take min mem_usedMemRate
                    if(row.mem_usedMemRate<min_mem_usedMemRateTemp&&row.crystalNodeGuid!=lastBestHitCrystalNodeCube.lastMem_usedMemRateCrystalNodeGuid){
                        
                        if(lastBestHitCrystalNodeCube.lastMem_usedMemRateCrystalNodeGuid!=""){
                            voteMap[lastBestHitCrystalNodeCube.lastMem_usedMemRateCrystalNodeGuid].mem_usedMemRate_weight--;
                        }
                        voteMap[row.crystalNodeGuid].mem_usedMemRate_weight++;
                        lastBestHitCrystalNodeCube.lastMem_usedMemRateCrystalNodeGuid=row.crystalNodeGuid;
                        min_mem_usedMemRateTemp=row.mem_usedMemRate;

                    }
                    //take max freemem
                    if(row.freemem>max_freememTemp&&row.crystalNodeGuid!=lastBestHitCrystalNodeCube.lastFreememCrystalNodeGuid){
                        
                        if(lastBestHitCrystalNodeCube.lastFreememCrystalNodeGuid!=""){

                            voteMap[lastBestHitCrystalNodeCube.lastFreememCrystalNodeGuid].freemem_weight--;
                        }
                        voteMap[row.crystalNodeGuid].freemem_weight++;
                        lastBestHitCrystalNodeCube.lastFreememCrystalNodeGuid=row.crystalNodeGuid;
                        max_freememTemp=row.freemem;
                    }

                    //take min loadAvg per 1,5,15
                    if(JSON.parse(row.loadAvg)[0]<min_loadAvg1Temp&&row.crystalNodeGuid!=lastBestHitCrystalNodeCube.lastLoadAvg1CrystalNodeGuid){

                        if(lastBestHitCrystalNodeCube.lastLoadAvg1CrystalNodeGuid!=""){
                            voteMap[lastBestHitCrystalNodeCube.lastLoadAvg1CrystalNodeGuid].loadAvg1_weight--;
                        }
                        voteMap[row.crystalNodeGuid].loadAvg1_weight++;
                        lastBestHitCrystalNodeCube.lastLoadAvg1CrystalNodeGuid=row.crystalNodeGuid;
                        min_loadAvg1Temp=JSON.parse(row.loadAvg)[0];
                    }

                    if(JSON.parse(row.loadAvg)[1]<min_loadAvg5Temp&&row.crystalNodeGuid!=lastBestHitCrystalNodeCube.lastLoadAvg5CrystalNodeGuid){

                        if(lastBestHitCrystalNodeCube.lastLoadAvg5CrystalNodeGuid!=""){
                            voteMap[lastBestHitCrystalNodeCube.lastLoadAvg5CrystalNodeGuid].loadAvg5_weight--;
                        }
                        voteMap[row.crystalNodeGuid].loadAvg5_weight++;
                        lastBestHitCrystalNodeCube.lastLoadAvg5CrystalNodeGuid=row.crystalNodeGuid;
                        min_loadAvg5Temp=JSON.parse(row.loadAvg)[1];
                    }

                    if(JSON.parse(row.loadAvg)[2]<min_loadAvg15Temp&&row.crystalNodeGuid!=lastBestHitCrystalNodeCube.lastLoadAvg15CrystalNodeGuid){

                        if(lastBestHitCrystalNodeCube.lastLoadAvg15CrystalNodeGuid!=""){
                            voteMap[lastBestHitCrystalNodeCube.lastLoadAvg15CrystalNodeGuid].loadAvg15_weight--;
                        }
                        voteMap[row.crystalNodeGuid].loadAvg15_weight++;
                        lastBestHitCrystalNodeCube.lastLoadAvg15CrystalNodeGuid=row.crystalNodeGuid;
                        min_loadAvg15Temp=JSON.parse(row.loadAvg)[2];
                    }

                }

                //loop voteMap and take the selected master node
                var maxAvgWeightScoreTemp=0;
                var selectedMasterNodeGuid="";
                for(var key in voteMap){
                    
                    let currentWeightScore=0;
                    let currentWeightAvgScore=0;
                    let scoreAvgItemCount=0;
                    for(var key2 in voteMap[key]){
                        
                        currentWeightScore+= voteMap[key][key2];
                        scoreAvgItemCount++;
                        
                    }
                    currentWeightAvgScore=(currentWeightScore/scoreAvgItemCount);
                    console.log("currentWeightAvgScore:",currentWeightAvgScore.toFixed(3));
                    
                    if(currentWeightAvgScore>maxAvgWeightScoreTemp){
                        selectedMasterNodeGuid=key;
                        maxAvgWeightScoreTemp=currentWeightAvgScore;
                    }

                }

                if(selectedMasterNodeGuid!="")
                {
                    for(let row of rows)
                    {
                        if(row.crystalNodeGuid===selectedMasterNodeGuid){
                            
                            callback(row);
                        }
                    }
                }
                else
                {
                        //select one radom
                        let radomIndex= diskDataCommon.GetRandomNum(0,rows.length-1);
                        callback(rows[radomIndex]);
                }


            }
       
     }


};

//Crystal cluster master timely meeting selection/vote
DeamonThreads.prototype.timelyMeetingSelectionVote=async function(httpMode){

    console.log("start timelyMeetingSelectionVote")
    //seek other node' self selection/vote result and update them into current nodeDB.
    var crystalCluster=conf.platformArch.crystalCluster;
    for(let ip in crystalCluster){
       
        if(diskDataCommon.whetherCrystalNodeItem(ip.trim()))   //remove non-ip key process
        {
            let crystalNodeIp=null,crystalNodePort=null;
            if(crystalCluster[ip].split(":").length>1){

                crystalNodeIp=crystalCluster[ip].split(":")[0];
                crystalNodePort=crystalCluster[ip].split(":")[1];
            }else{
                crystalNodeIp=crystalCluster[ip];
                crystalNodePort=80;
            }

            //seek other node result
            if(crystalNodeIp.trim()!==diskDataCommon.getCurrentServerIpAdress().trim()
            ||crystalNodeIp.trim()==="127.0.0.1"){

                var domainUrl=crystalNodeIp+":"+crystalNodePort;
                var partialUrl="/readMe";
                var qs=""
                var timeout=conf.platformArch.defaultHttpReqTimeOut;
                var body={
                    'type':'seekNodeSelectionVoteResult'  
                };
                let res=await DiskDataHttpHelper.apiSimpleRequest(httpMode,domainUrl,partialUrl,qs,body,timeout);
                var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
              
                for(let row of res){
                    crystalClusterInfoRecord.crystalMasterVoteSelect("","where crystalNodeIp=? and crystalNodePort=?",[row.crystalNodeIp,row.crystalNodePort],"",function(rows){
                        if(rows!==undefined)
                        {
                           // console.log('current rows:',rows);
                            if(rows.length>0){
                                var crystalMasterVote=new CrystalMasterVote(rows[0].crystalNodeId,rows[0].crystalNodeGuid,rows[0].lastVoteMeNodesIps.indexOf(crystalNodeIp.trim())<0? rows[0].lastVoteMeNodesIps+";"+crystalNodeIp.trim():rows[0].lastVoteMeNodesIps,
                                (rows[0].lastVotePerformanceDump),rows[0].lastVoteCount+1,
                                rows[0].createTime,rows[0].crystalNodeIp,rows[0].crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType);
                                crystalClusterInfoRecord.crystalMasterVoteUpdate(crystalMasterVote);

                            }else if(rows.length===0){
                                var crystalMasterVote=new CrystalMasterVote(row.crystalNodeId,row.crystalNodeGuid,crystalNodeIp.trim(),
                                (row.lastVotePerformanceDump),row.lastVoteCount,
                                diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),row.crystalNodeIp,row.crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType);
                                crystalClusterInfoRecord.crystalMasterVoteInsert(crystalMasterVote);
                            }
                        }

                    });
              }
            }
        }
    }

};


//clear the lastVoteCount timely
DeamonThreads.prototype.timelySelectionVoteResultClear=function(){
    
    if(this.crystalClusterInfoRecord===undefined){
       this.crystalClusterInfoRecord=new CrystalClusterInfoRecord();
    }
    this.crystalClusterInfoRecord.crystalMasterVoteSelect("","",[""],"",function(rows){
        if(rows!=undefined){
               for(let row of rows){
                   var crystalClusterInfoRecord=new CrystalClusterInfoRecord();
                   var crystalMasterVote=new CrystalMasterVote(row.crystalNodeId,row.crystalNodeGuid,row.lastVoteMeNodesIps,
                   (row.lastVotePerformanceDump),0,
                   row.createTime,row.crystalNodeIp,row.crystalNodePort,conf.platformArch.crystalCluster.interactProtocolType);
                   crystalClusterInfoRecord.crystalMasterVoteClear(crystalMasterVote);
               }
        }
    });
    
};


//Verify current node crystal cluster role
DeamonThreads.prototype.getCurrentNodeRole=function(callback){

    //get all the crystal cluster node except current node ip from conf file
    let crystalCluster=conf.platformArch.crystalCluster;
    let crystalIpAndPortList=[];
    for(let ip in crystalCluster){
    
         if(diskDataCommon.whetherCrystalNodeItem(ip.trim()))   
         {
             let crystalNodeIp=null,crystalNodePort=null;
             if(crystalCluster[ip].split(":").length>1){
 
                 crystalNodeIp=crystalCluster[ip].split(":")[0];
                 crystalNodePort=crystalCluster[ip].split(":")[1];
             }else{
                 crystalNodeIp=crystalCluster[ip];
                 crystalNodePort=80;
             }

             crystalIpAndPortList.push(crystalNodeIp+":"+crystalNodePort);
         }
   }
    //random select one of crystal cluster ip which not self from the set
     let randomCrystalIpPortIndex=diskDataCommon.GetRandomNum(0,crystalIpAndPortList.length-1);
    //send request to the random catched crystal cluster ip api and get vote result
    var domainUrl=crystalIpAndPortList[randomCrystalIpPortIndex];
    var partialUrl="/readMe";
    var qs=""
    var timeout=conf.platformArch.defaultHttpReqTimeOut;
    var body={
        'type':'seekMasterNodeVoteResult'  
    };
    DiskDataHttpHelper.apiSimpleRequestWithCallBack(conf.platformArch.crystalCluster.httpDefaultMode,domainUrl,partialUrl,qs,body,timeout,function(res){
          //verify whether current node ip===other voted crystal cluster master node
          if(diskDataCommon.getCurrentServerIpAdress().trim()===res.crystalNodeIp.trim()){
               //if ture return 'm' as master role
              callback("m");
          }else{
               //if false return 'w' as worker role
              callback("w");
          }
       
       
    });
  
}


module.exports=DeamonThreads;