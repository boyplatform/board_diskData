var mssqlConf = {
    user: 'sa',
    password: 'Saboy3210',
    server: 'B4E62ROkd-29j',
    database: 'PerformanceTest',
    port: 2048,
    options: {
    encrypt: false // Use this if you're on Windows Azure=true
    }, 
    pool: {
        min: 0,
        max: 300,
        idleTimeoutMillis: 3000
    }
};

var mysqlConf = {

     dbConfig:{
        host: '127.0.0.1',
        user: 'root',
        port: 3306,
        password:'whoisboy',
        database: 'board_diskData'

     },
     onError: function(err){
        console.dir(err);
     },
     customError: null,
     timeout: 300,
     debug: false
};

var diskDataDBConf = {

   dbConfig:{
      host: '127.0.0.1',    //one one map to mysql db node--one diskData nodejs micro-service map to one mysql db reproduce-node ||OR|| map to the local mysql db on current diskData nodejs micro-service node. 
      user: 'root',
      port: 3306,
      password:'whoisboy',
      database: 'board_usb' //for biz projects,if project need a single DB change it into 'board_usb_proj',if project work with prod-biz DB change it into '[prod_biz_DbName]'

   },
   onError: function(err){
      console.dir(err);
   },
   customError: null,
   timeout: 30,
   debug: false
};

var memCachedPoolConfig={
   'host': ['192.168.125.132:11166','192.168.125.133:11166'],
   'connectionLimit': '66',
   'timeout' : 50000
};

var redisPoolConfig={
   host:"192.168.125.134",
   port:6666,
   opts:{}
};

var redisClusterPoolConfig=[
   {
      port:6666,
      host:"192.168.125.134"
   },
   {
      port:6666,
      host:"192.168.125.135"
   },
   {
      port:6666,
      host:"192.168.125.136"
   },
   {
      port:6666,
      host:"192.168.125.137"
   },
   {
      port:6666,
      host:"192.168.125.138"
   },
   {
      port:6666,
      host:"192.168.125.139"
   }
];

var platformArch= {
     defaultHttpReqTimeOut:6000,
     masterMandantoryVerifyTimeOut:40,
     shaHashLengh:36,
     shaHashTimes:3,
     DeamonThreadSecRate:{
      
       forNodePerformanceCollection:35,
       forMasterNodeSelfSelection:60,
       forMasterNodeMeetingSelection:100,
       forEffectiveMasterNodeVoteResult:120,
       forTimelySelectionVoteResultClear:900,
       forCrystalTalkingSender:20,
       forCrystalTalkingMasterConfirmReqProcessing:35,
       forCrystalTalkingOperationExecute:40,
       forCrystalTalkingRemoveNonActiveRequest:50,
       forCrystalTalkingOperationConfirmChecker:50,
       forGetCurrentNodeRolePromiseTime:50
     },
     crystalCluster:{
        definedOperationLogCheckFailedTimes:3,
        interactProtocolType:0,
        httpDefaultMode:"http",
        defaultTalkingPort:8080,
        crystalTalkingSize:30,
        allowDuplicateOpTalking:true,
        crystalResendTimeout:30,
        ip1:'127.0.0.1:8080',
        ip2:'127.0.0.1:8080',
        ip3:'127.0.0.1:8080',
        ip4:'127.0.0.1:8080'
     },
     serviceFor:{
       appId:0,
       appName:'',
       appGuid:'',
       reqStorageClusterType:0
     },
     runningMode:"mock",  //mock-for test via API or realCluster-for work with memory cluster together.
     redisMode:"cluster",
     NonBlockChainSubscribeChannel:"NONBLOCKCHAINWRITE"
};

exports.mssqlConfig = mssqlConf;
exports.mysqlConfig = mysqlConf;
exports.platformArch=platformArch;
exports.redisPoolConfig=redisPoolConfig;
exports.memCachedPoolConfig=memCachedPoolConfig;
exports.diskDataDBConf=diskDataDBConf;
exports.redisClusterPoolConfig=redisClusterPoolConfig;