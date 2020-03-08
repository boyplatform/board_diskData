CREATE DATABASE `board_diskData` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

drop table if exists RequestLog;

/*==============================================================*/
/* Table: RequestLog                                            */
/*==============================================================*/
create table RequestLog
(
   reqId                bigint not null auto_increment,
   appId                bigint,
   appName              varchar(255),
   appGuid              varchar(255),
   userId               bigint,
   url                  text,
   createTime           timestamp default CURRENT_TIMESTAMP,
   reqStorageClusterType int comment '0=mysql
            1=mssql
            2=db2
            3=oracle',
   reqGuid              varchar(255),
   isActive             bit default 1 comment 'false=not active
            true=active',
   userGuid             varchar(255),
   writeSqlSha          varchar(166),
   writeSql             text,
   isConfirmedByMaster  bit default false,
   isSentToMaster       bit default false,
   targetDbName         varchar(166),
   sendToMasterTime     timestamp,
   confirmedByMasterIp  varchar(255),
   primary key (reqId)
);

alter table RequestLog comment 'The Sql Execution req from Memory.';


drop table if exists operationLog;

/*==============================================================*/
/* Table: operationLog                                          */
/*==============================================================*/
create table operationLog
(
   operationLogId       bigint not null auto_increment,
   operationStorageClusterType int comment '0=mysql
            1=other',
   operationLogGuid     varchar(255),
   userId               bigint,
   userName             varchar(255),
   operationType        int comment '1=add
            2=update
            3=delete
            4=logicDelete
            5=read',
   operationLogTime     timestamp default CURRENT_TIMESTAMP,
   appId                bigint,
   docId                bigint,
   exfModuleId          bigint,
   viewId               bigint,
   platformControllerId bigint,
   platformActionId     bigint,
   usingObjectId        bigint,
   bizUserRoleId        bigint,
   deviceId             bigint,
   devLangId            bigint,
   operationStatusId    bigint comment '0=init one operation
            1=verification under current center
            2=confirmation by center meeting
            3=on processing
            4=done',
   userGuid             varchar(255),
   appGuid              varchar(255),
   workFlowStatusId     bigint,
   writeSqlSha          varchar(166),
   writeSql             text,
   targetDbName         varchar(166),
   primary key (operationLogId)
);

alter table operationLog comment 'The Sql Execution(operation) records per req from Memory und';

drop table if exists operationLogSummarySha;

/*==============================================================*/
/* Table: operationLogSummarySha                                */
/*==============================================================*/
create table operationLogSummarySha
(
   shaCheckId           bigint not null auto_increment comment 'block check ID',
   latestCheckOperationSha varchar(166),
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   createTime           timestamp,
   isConfirmedByMaster  bit default 0,
   notMatchedCount      bigint default 0,
   shaCheckGuid         varchar(255),
   isActive             bit default 1 comment 'verify whether current operationlog is alived.',
   isSendToMaster       bit default 0,
   sendToMasterTime     timestamp,
   isNeedRestore        bit,
   confirmedByMasterIp  varchar(255),
   primary key (shaCheckId)
);


drop table if exists operationLogShadow;

/*==============================================================*/
/* Table: operationLogShadow                                    */
/*==============================================================*/
create table operationLogShadow
(
   operationLogId       bigint not null auto_increment,
   operationStorageClusterType int comment '0=mysql
            1=other',
   operationLogGuid     varchar(255),
   userId               bigint,
   userName             varchar(255),
   operationType        int comment '1=add
            2=update
            3=delete
            4=logicDelete
            5=read',
   operationLogTime     timestamp default CURRENT_TIMESTAMP,
   appId                bigint,
   docId                bigint,
   exfModuleId          bigint,
   viewId               bigint,
   platformControllerId bigint,
   platformActionId     bigint,
   usingObjectId        bigint,
   bizUserRoleId        bigint,
   deviceId             bigint,
   devLangId            bigint,
   operationStatusId    bigint comment '0=init one operation
            1=verification under current center
            2=confirmation by center meeting
            3=on processing
            4=done',
   userGuid             varchar(255),
   appGuid              varchar(255),
   workFlowStatusId     bigint,
   writeSqlSha          varchar(166),
   writeSql             text,
   targetDbName         varchar(166),
   primary key (operationLogId)
);

alter table operationLogShadow comment 'The Sql Execution(operation) records per req from Memory und';


drop table if exists operationLogLanding;

/*==============================================================*/
/* Table: operationLogLanding                                   */
/*==============================================================*/
create table operationLogLanding
(
   operationLogId       bigint not null auto_increment,
   operationStorageClusterType int comment '0=mysql
            1=other',
   operationLogGuid     varchar(255),
   userId               bigint,
   userName             varchar(255),
   operationType        int comment '1=add
            2=update
            3=delete
            4=logicDelete
            5=read',
   operationLogTime     timestamp default CURRENT_TIMESTAMP,
   appId                bigint,
   docId                bigint,
   exfModuleId          bigint,
   viewId               bigint,
   platformControllerId bigint,
   platformActionId     bigint,
   usingObjectId        bigint,
   bizUserRoleId        bigint,
   deviceId             bigint,
   devLangId            bigint,
   operationStatusId    bigint comment '0=init one operation
            1=verification under current center
            2=confirmation by center meeting
            3=on processing
            4=done',
   userGuid             varchar(255),
   appGuid              varchar(255),
   workFlowStatusId     bigint,
   writeSqlSha          varchar(166),
   writeSql             text,
   targetDbName         varchar(166),
   primary key (operationLogId)
);

alter table operationLogLanding comment 'The Sql Execution(operation) records per req from Memory und';



drop table if exists DBUpgradeHistory;

/*==============================================================*/
/* Table: DBUpgradeHistory                                      */
/*==============================================================*/
create table DBUpgradeHistory
(
   nodeDbUpgradeHIstoryId bigint not null auto_increment,
   nodeDbGuid           varchar(255),
   nodeDbName           varchar(255),
   fromPlatformDbVersion bigint,
   toPlatformDbVersion  bigint,
   upgradeTime          timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   currentPlatformUser  bigint,
   platformUserLoginName varchar(255),
   platformUserName     varchar(255),
   platformHostGuid     varchar(255),
   comments             varchar(255),
   nodeDbUpgradeHIstoryGuid varchar(255),
   isActive             bit default 1,
   primary key (nodeDbUpgradeHIstoryId)
);

drop table if exists customerDbList;

/*==============================================================*/
/* Table: customerDbList                                        */
/*==============================================================*/
create table customerDbList
(
   id                   bigint not null auto_increment,
   guid                 varchar(255) not null,
   dataSourceClassName  varchar(255),
   dataSourceUser       varchar(255),
   dataSourcePassword   varchar(255),
   dataSourceDataBaseName varchar(255),
   dataSourcePortNumber bigint default 3306,
   dataSourceServerName varchar(255),
   remark               varchar(255),
   dbTypeNum            bigint default 0,
   isActive             bit default 1,
   createTime           datetime,
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   primary key (id)
);

alter table customerDbList comment 'config except nodeDB, which third party injected datasource ';

drop table if exists unitNodeRelation;

/*==============================================================*/
/* Table: unitNodeRelation                                      */
/*==============================================================*/
create table unitNodeRelation
(
   r_crystalNodeId      bigint,
   appId                bigint,
   r_crystalNodeGuid    varchar(255),
   isActive             bit default 1,
   createTime           datetime,
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   unitNodeRelationId   bigint not null auto_increment,
   unitNodeRelationGuid varchar(255),
   unitNodeRole         bigint,
   unitNodeSource       int comment '0=managed under devops
            1=network seed',
   unitNodeIp           varchar(66),
   unitNodePort         bigint,
   unitNodeProtocolType int comment '0=http
            1=tcp
            2=udp',
   mem_totalHeap        double,
   mem_heapUsed         double,
   mem_totalForCurrentProcess double,
   mem_totalOnV8EngineUsing double,
   mem_usedMemRate      double,
   cpuArch              varchar(255),
   cpuInfo              varchar(2048),
   freemem              bigint,
   hostName             varchar(255),
   loadAvg              varchar(255),
   networkInterface     varchar(1024),
   platformtype         varchar(255),
   platformVersion      varchar(255),
   osTempDir            varchar(255),
   totalMemory          bigint,
   osType               varchar(255),
   nodeNormalRunedTime  bigint,
   primary key (unitNodeRelationId)
);

alter table unitNodeRelation comment 'define some particular relationship between unitnode and pla';

drop table if exists crystalClusterBlock;

/*==============================================================*/
/* Table: crystalClusterBlock                                   */
/*==============================================================*/
create table crystalClusterBlock
(
   crystalNodeId        bigint not null auto_increment,
   crystalNodeGuid      varchar(255),
   crystalNodeIp        varchar(66),
   crystalNodePort      bigint default 666,
   interactProtocolType int default 0 comment '0=http
            1=tcp
            2=udp',
   mem_totalHeap        double,
   mem_heapUsed         double,
   mem_totalForCurrentProcess double,
   mem_totalOnV8EngineUsing double,
   mem_usedMemRate      double comment '%',
   cpuArch              varchar(255) comment 'os.arch()',
   cpuInfo              varchar(2048) comment 'os.cpus()',
   freemem              bigint comment 'os.freemem(),byte',
   hostName             varchar(255) comment 'os.hostname()',
   loadAvg              varchar(255) comment 'os.loadavg()',
   networkInterface     varchar(10240) comment 'os.networkInterface()',
   platformtype         varchar(255) comment 'os.platform()',
   platformVersion      varchar(255) comment 'os.release()',
   osTempDir            varchar(255) comment 'os.tmpdir()',
   totalMemory          bigint comment 'os.totalmem(),byte',
   osType               varchar(255) comment 'os.type(), base on linux=linux, base on apple=Darwin,base on win=Windows_NT',
   nodeNormalRunedTime  bigint comment 'os.uptime()',
   crstalNodeRole       int default 1 comment '0=master
            1=worker',
   primary key (crystalNodeId)
);

drop table if exists crystalMasterVote;

/*==============================================================*/
/* Table: crystalMasterVote                                     */
/*==============================================================*/
create table crystalMasterVote
(
   crystalNodeId        bigint not null,
   crystalNodeGuid      varchar(255) not null,
   lastVoteMeNodesIps   varchar(255),
   lastVotePerformanceDump varchar(2048),
   lastVoteCount        bigint,
   createTime           datetime,
   updateTime           timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   crystalNodeIp        varchar(255),
   crystalNodePort      bigint,
   interactProtocolType int comment '0=http
            1=tcp
            2=udp
            3=https',
   primary key (crystalNodeId)
);

