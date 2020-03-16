//import section
var express= require('express');
var app=express();
var bodyParser = require('body-parser');
 

var DiskDataValidation=require('../src/boyDiskDataValidation.js');
var diskDataValidationObj=new DiskDataValidation();
var RequestLog=require('../pojo/RequestLog');
var OperationLogSummarySha=require('../pojo/operationLogSummarySha');

var diskDataCommon=require('../src/boyDiskDataCommon.js');
var conf=require('../src/config.js');

var selfIntroduce=require('../crystalBlock/selfExpress/selfIntroduce');
 
var CrystalClusterCommonRules_deamonThreads=require('../crystalBlock/common/CrystalClusterCommonRulesImp/deamonThreads');
var CrystalClusterCommonRules_decideAndAction=require('../crystalBlock/common/CrystalClusterCommonRulesImp/decideAndAction');
var CrystalClusterCommonRules_interact=require('../crystalBlock/common/CrystalClusterCommonRulesImp/interact');

 
var DataOperaSyncRules_deamonThreads=require('../crystalBlock/task/DataOperaSyncRulesImp/deamonThreads');
var DataOperaSyncRules_decideAndAction=require('../crystalBlock/task/DataOperaSyncRulesImp/decideAndAction');
var DataOperaSyncRules_interact=require('../crystalBlock/task/DataOperaSyncRulesImp/interact');

var DataOperaBlockCheckRules_deamonThreads=require('../crystalBlock/task/DataOperaBlockCheckRulesImp/deamonThreads');
var DataOperaBlockCheckRules_decideAndAction=require('../crystalBlock/task/DataOperaBlockCheckRulesImp/decideAndAction');
var DataOperaBlockCheckRules_interact=require('../crystalBlock/task/DataOperaBlockCheckRulesImp/interact');

var DiskDataNodeInfoRecord=require('../Dao/DiskDataNodeInfoRecord');
var DataOperator=require('../DataOperator/DataOperator');

 
var crystalClusterCommonRules_deamonThreads=new CrystalClusterCommonRules_deamonThreads();
var crystalClusterCommonRules_decideAndAction=new CrystalClusterCommonRules_decideAndAction();
var crystalClusterCommonRules_interact=new CrystalClusterCommonRules_interact();


 
var dataOperaSyncRules_deamonThreads=new DataOperaSyncRules_deamonThreads();
var dataOperaSyncRules_decideAndAction=new DataOperaSyncRules_decideAndAction();
var dataOperaSyncRules_interact=new DataOperaSyncRules_interact();

var dataOperaBlockCheckRules_deamonThreads=new DataOperaBlockCheckRules_deamonThreads();
var dataOperaBlockCheckRules_decideAndAction=new DataOperaBlockCheckRules_decideAndAction();
var dataOperaBlockCheckRules_interact=new DataOperaBlockCheckRules_interact();

var diskDataNodeInfoRecord=new DiskDataNodeInfoRecord();
var dataOperator=new DataOperator();

//install midware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//Programe Entry
var server=app.listen(8080,'0.0.0.0', function(){
 
   //internet模式下启动时初始化并缓存本机公网IP
   if(conf.platformArch.crystalCluster.CrystalClusterNetworkMode==="internet"){
      diskDataCommon.initCurrentServerPubIpAdress();
    }
     console.log('Intelligent boy-diskData is running on current crystal node at:'+(new Date()).toLocaleString()," on IP:",diskDataCommon.getCurrentServerIpAdress().trim());
       
     //依赖注入
     dataOperaSyncRules_deamonThreads.interact=dataOperaSyncRules_interact;
     dataOperaSyncRules_decideAndAction.interact=dataOperaSyncRules_interact;
     dataOperaSyncRules_deamonThreads.dataOperaBlockCheckDecideAndAction=dataOperaBlockCheckRules_decideAndAction;
     dataOperaSyncRules_decideAndAction.dataOperaBlockCheckDecideAndAction=dataOperaBlockCheckRules_decideAndAction;

     dataOperaBlockCheckRules_deamonThreads.interact=dataOperaBlockCheckRules_interact;
     dataOperaBlockCheckRules_decideAndAction.interact=dataOperaBlockCheckRules_interact;
     dataOperaBlockCheckRules_deamonThreads.decideAndAction=dataOperaBlockCheckRules_decideAndAction;
     dataOperaBlockCheckRules_interact.decideAndAction=dataOperaBlockCheckRules_decideAndAction;
      
     //-----------打开boy-diskData守护线程---------------------------
 
      //启动master节点选择相关线程
      diskDataCommon.setDeamonThreadJobWithArgs(crystalClusterCommonRules_deamonThreads.nodePerformanceCollect.bind(crystalClusterCommonRules_deamonThreads),conf.platformArch.crystalCluster.httpDefaultMode,conf.platformArch.DeamonThreadSecRate.forNodePerformanceCollection);
      diskDataCommon.setDeamonThreadJob(crystalClusterCommonRules_deamonThreads.timelySelfNatureSelectionVote.bind(crystalClusterCommonRules_deamonThreads),conf.platformArch.DeamonThreadSecRate.forMasterNodeSelfSelection);
      diskDataCommon.setDeamonThreadJobWithArgs(crystalClusterCommonRules_deamonThreads.timelyMeetingSelectionVote.bind(crystalClusterCommonRules_deamonThreads),conf.platformArch.crystalCluster.httpDefaultMode,conf.platformArch.DeamonThreadSecRate.forMasterNodeMeetingSelection);
      diskDataCommon.setDeamonThreadJob(crystalClusterCommonRules_decideAndAction.effectiveMasterNodeVoteResult.bind(crystalClusterCommonRules_decideAndAction),conf.platformArch.DeamonThreadSecRate.forEffectiveMasterNodeVoteResult);
      diskDataCommon.setDeamonThreadJob(crystalClusterCommonRules_deamonThreads.timelySelectionVoteResultClear.bind(crystalClusterCommonRules_deamonThreads),conf.platformArch.DeamonThreadSecRate.forTimelySelectionVoteResultClear);

      
      //---启动数据共识订阅与同步处理规则相关线程&操作---
       //verify whether current node is master and get node role result for current node
       diskDataCommon.setDeamonThreadJob(function(){
            crystalClusterCommonRules_deamonThreads.getCurrentNodeRole(function(nodeRoleRs){
               dataOperaSyncRules_decideAndAction.nodeRoleRs=nodeRoleRs;
                  crystalClusterCommonRules_deamonThreads.nodeRoleRs=nodeRoleRs;
                  console.log('nodeRoleRs:',nodeRoleRs);      
            })
       },conf.platformArch.DeamonThreadSecRate.forGetCurrentNodeRolePromiseTime);
       
       if(conf.platformArch.runningMode==="master"){
            //订阅当前节点中所有node db中的数据库频道
        /*     diskDataNodeInfoRecord.showDataBases(function(rows){
               
               if(rows!==undefined){
                  for(let row of rows){
                   
                        dataOperaSyncRules_decideAndAction.getWriteOperationMessageStart(row.Database.toString().toUpperCase()+conf.platformArch.serviceFor.reqStorageClusterType.toString(),conf.platformArch.serviceFor.appId,conf.platformArch.serviceFor.appName,conf.platformArch.serviceFor.appGuid,conf.platformArch.serviceFor.reqStorageClusterType);
                  }
               }
            },conf.platformArch.serviceFor.reqStorageClusterType); */
             //start operationLog block check processing
             if(conf.platformArch.serviceFor.reqStorageClusterType===0){
               dataOperaSyncRules_decideAndAction.getWriteOperationMessageStart(conf.diskDataDBConf.dbConfig.database.toUpperCase()+conf.platformArch.serviceFor.reqStorageClusterType.toString(),conf.platformArch.serviceFor.appId,conf.platformArch.serviceFor.appName,conf.platformArch.serviceFor.appGuid,conf.platformArch.serviceFor.reqStorageClusterType);
             }else if(conf.platformArch.serviceFor.reqStorageClusterType===1){
               dataOperaSyncRules_decideAndAction.getWriteOperationMessageStart(conf.diskDataDBConf_Mssql.database.toUpperCase()+conf.platformArch.serviceFor.reqStorageClusterType.toString(),conf.platformArch.serviceFor.appId,conf.platformArch.serviceFor.appName,conf.platformArch.serviceFor.appGuid,conf.platformArch.serviceFor.reqStorageClusterType);
             }
        //订阅非block chain的直接操作
            dataOperaSyncRules_decideAndAction.getWriteOperationMessageStart(conf.platformArch.NonBlockChainSubscribeChannel.toUpperCase()+conf.platformArch.serviceFor.reqStorageClusterType.toString(),conf.platformArch.serviceFor.appId,conf.platformArch.serviceFor.appName,conf.platformArch.serviceFor.appGuid,conf.platformArch.serviceFor.reqStorageClusterType);
      }
        
        //共识数据订阅与同步处理相关线程   
      diskDataCommon.setDeamonThreadJob(dataOperaSyncRules_deamonThreads.crystalTalkingSender.bind(dataOperaSyncRules_deamonThreads),conf.platformArch.DeamonThreadSecRate.forCrystalTalkingSender);
      diskDataCommon.setDeamonThreadJob(dataOperaSyncRules_decideAndAction.crystalTalkingMasterConfirmReqProcessing.bind(dataOperaSyncRules_decideAndAction),conf.platformArch.DeamonThreadSecRate.forCrystalTalkingMasterConfirmReqProcessing);
      diskDataCommon.setDeamonThreadJob(dataOperaSyncRules_deamonThreads.crystalTalkingOperationExecute.bind(dataOperaSyncRules_deamonThreads),conf.platformArch.DeamonThreadSecRate.forCrystalTalkingOperationExecute);
      diskDataCommon.setDeamonThreadJob(dataOperaSyncRules_deamonThreads.crystalTalkingRemoveNonActiveRequest.bind(dataOperaSyncRules_deamonThreads),conf.platformArch.DeamonThreadSecRate.forCrystalTalkingRemoveNonActiveRequest);
      diskDataCommon.setDeamonThreadJob(dataOperaSyncRules_deamonThreads.crystalTalkingOperationConfirmChecker.bind(dataOperaSyncRules_deamonThreads),conf.platformArch.DeamonThreadSecRate.forCrystalTalkingOperationConfirmChecker);

      //---启动数据一致性共识处理规则相关线程&操作---
      //to be continue from here
})


app.post('/crystalTalkingReceiver',async function(req,res){

    
       //入口参数验证
       let validationRs=await diskDataValidationObj.InputValidator(req.body,'/crystalTalkingReceiver');
       if(validationRs.Result===false){
          
            res.end(JSON.stringify(validationRs));
            return;
       }
       
       let requestLog=null;
       let operationLogSummarySha=null;
       switch(req.body.type.toString()){
         case 'getWopMessageStartForMockTest':
         dataOperaSyncRules_interact.getWriteOperationMessageStartForMockTest(req.body.message,req.body.targetDbName,req.body.appId,req.body.appName,req.body.appGuid,req.body.reqStorageClusterType,res);
         break;
         case 'opGetReqFromSubNode':
           requestLog=new RequestLog(req.body.appId,req.body.appName,req.body.appGuid,req.body.userId,req.body.url
            ,diskDataCommon.GetFormatDateFromTimeSpan(Date.now()),req.body.reqStorageClusterType,req.body.reqGuid,true,req.body.userGuid,req.body.writeSqlSha,req.body.writeSql,false,false,diskDataCommon.getClientIP(req),null); //w-s ip
            requestLog.isResendReqOrNot=req.body.isResendReqOrNot;
         res.end(dataOperaSyncRules_interact.crystalTalkingMasterConfirmReqReceiver(requestLog));
         break;
         
         case 'opMasterConfirmResult':
           requestLog=new RequestLog(null,null,null,null,null
            ,null,null,req.body.reqGuid,null,null,null,null,null,null,diskDataCommon.getClientIP(req),null); //m ip
            requestLog.whetherConfirm=req.body.isConfirmed;
            res.end(dataOperaSyncRules_interact.crystalTalkingOperationConfirmReceiver(requestLog));
         break;

         case 'opGetLogSummaryShaFromSubNode':
           operationLogSummarySha=new OperationLogSummarySha();
         operationLogSummarySha.shaCheckGuid=req.body.shaCheckGuid;
         operationLogSummarySha.latestCheckOperationSha=req.body.latestCheckOperationSha;
         operationLogSummarySha.createTime=req.body.createTime;
         operationLogSummarySha.isResendReqOrNot=req.body.isResendReqOrNot;
         operationLogSummarySha.comeFromCrystalNodeIp=diskDataCommon.getClientIP(req);
         res.end(dataOperaBlockCheckRules_interact.crystalTalkingMasterReceiveSubSummarySha(operationLogSummarySha));
         break;

         case 'opLogSummaryShaConfirmResult':
           operationLogSummarySha=new OperationLogSummarySha();
         operationLogSummarySha.shaCheckGuid=req.body.shaCheckGuid;
         operationLogSummarySha.isConfirmedByMaster=req.body.isConfirmed;
         operationLogSummarySha.comeFromCrystalNodeIp=diskDataCommon.getClientIP(req);
         res.end(dataOperaBlockCheckRules_interact.crystalTalkingSubReceiveMasterSummaryShaVerificationResult(operationLogSummarySha));
         break;

         case 'opExportOperationLog':
         dataOperaBlockCheckRules_interact.exportOperationLog(req.body.checkTimePoint,function(rows){
            
            res.end(JSON.stringify(rows));
               
         });
         break;
         default:
            res.end('Wrong Command type!Please double check your command.')
    }
             
})


//export data to outside
app.post('/getDiskData',async function(req,res){

      //入口参数验证
      let validationRs=await diskDataValidationObj.InputValidator(req.body,'/getDiskData');
      if(validationRs.Result===false){
         
            res.end(JSON.stringify(validationRs));
            return;
      } 
      
      dataOperator.executeQuery(req.body.querySql,function(rows){
         let result={};
         if(rows!=undefined){
               
               result["responseId"]=diskDataCommon.getUUID();
               result["responseTime"]=diskDataCommon.GetFormatDateFromTimeSpan(Date.now());
               result["result"]=rows;
                
         }else{
               result["responseId"]=diskDataCommon.getUUID();
               result["responseTime"]=diskDataCommon.GetFormatDateFromTimeSpan(Date.now());
               result["result"]=[];
              
         }

         res.end(JSON.stringify(result));
      },conf.platformArch.serviceFor.reqStorageClusterType);

})

//readme api
app.post('/readMe',async function(req,res){
    
        //入口参数验证
       let validationRs=await diskDataValidationObj.InputValidator(req.body,'/readMe');
       if(validationRs.Result===false){
          
            res.end(JSON.stringify(validationRs));
            return;
       } 

       //进入执行入口
        let jsonBody=req.body; 
        switch(jsonBody.type.toString()){
             case 'osInfo':
                res.end(JSON.stringify(selfIntroduce.getNodeOSInfo()));
                break;
             case 'mem':
                res.end(JSON.stringify(selfIntroduce.getCurrentNodeMem()));
                break;
             case 'battery':
                res.end(JSON.stringify(selfIntroduce.getCurrentNodeBattery()));
                break;
             case 'crystalCluster':
             
               if(req.body.httpMode!=undefined){
                  selfIntroduce.getCurrentCrystalCluster(res,req.body.httpMode,req.body.infoType);
               }else{
                  selfIntroduce.getCurrentCrystalCluster(res,conf.platformArch.crystalCluster.httpDefaultMode,req.body.infoType);
               }
                break;
            case 'seekNodeSelectionVoteResult':
                 
                   crystalClusterCommonRules_interact.timelyNodeSelectionVoteResultSeek(function(rows){

                   res.end(JSON.stringify(rows));
                })
                break;
            case 'seekMasterNodeVoteResult':
                 
                   crystalClusterCommonRules_interact.seekMasterNodeVoteResult(function(row){

                   res.end(JSON.stringify(row));
                })
                break;
             default:
                res.end('Wrong Command type!Please double check your command.')
        }
   

})

//teachKnowledgeAPI



//learnKnowledgeAPI(take&pull)


//platformOpsIncretionAPI


//modilityFriendSensorAPI--verify,add,remove,weightSetting,role&task allocation vote for cluster/friend node

//modilityKnowSelfBadAPI--get bad report from cluster/friend node 