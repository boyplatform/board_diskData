'use strict'
function unitNodeRelation(appId,unitNodeGuid,isActive,createTime,updateTime,unitNodeRelationId,
    unitNodeRelationGuid,unitNodeRole,unitNodeSource,unitNodeIp,unitNodePort,unitNodeProtocolType,
    mem_totalHeap,mem_heapUsed,mem_totalForCurrentProcess,mem_totalOnV8EngineUsing,mem_usedMemRate,
    cpuArch,cpuInfo,freemem,hostName,loadAvg,networkInterface,platformtype,platformVersion,osTempDir,
    totalMemory,osType,nodeNormalRunedTime){

        this.appId=appId;
        this.unitNodeGuid=unitNodeGuid;
        this.isActive=isActive;
        this.createTime=createTime;
        this.updateTime=updateTime;
        this.unitNodeRelationId=unitNodeRelationId;
        this.unitNodeRelationGuid=unitNodeRelationGuid;
        this.unitNodeRole=unitNodeRole;
        this.unitNodeSource=unitNodeSource;
        this.unitNodeIp=unitNodeIp;
        this.unitNodePort=unitNodePort;
        this.unitNodeProtocolType=unitNodeProtocolType;
        this.mem_totalHeap=mem_totalHeap;
        this.mem_heapUsed=mem_heapUsed;
        this.mem_totalForCurrentProcess=mem_totalForCurrentProcess;
        this.mem_totalOnV8EngineUsing=mem_totalOnV8EngineUsing;
        this.mem_usedMemRate=mem_usedMemRate;
        this.cpuArch=cpuArch;
        this.cpuInfo=cpuInfo;
        this.freemem=freemem;
        this.hostName=hostName;
        this.loadAvg=loadAvg;
        this.networkInterface=networkInterface;
        this.platformtype=platformtype;
        this.platformVersion=platformVersion;
        this.osTempDir=osTempDir;
        this.totalMemory=totalMemory;
        this.osType=osType;
        this.nodeNormalRunedTime=nodeNormalRunedTime;

};

unitNodeRelation.prototype={
    constructor: unitNodeRelation,
    getAppId:function(){

        return this.appId;
    },
    getUnitNodeGuid:function(){

        return this.unitNodeGuid;
    },
    getIsActive:function(){

        return this.isActive;
    },
    getCreateTime:function(){

        return this.createTime;
    },
    getUpdateTime:function(){

        return this.updateTime;
    },
    getUnitNodeRelationId:function(){

        return this.unitNodeRelationId;
    },
    getUnitNodeRelationGuid:function(){

        return this.unitNodeRelationGuid;
    },
    getUnitNodeRole:function(){

        return this.unitNodeRole;
    },
    getUnitNodeSource:function(){

        return this.unitNodeSource;
    },
    getUnitNodeIp:function(){

        return this.unitNodeIp;
    },
    getUnitNodePort:function(){

        return this.unitNodePort;
    },
    getUnitNodeProtocolType:function(){

        return this.unitNodeProtocolType;
    },
    getMem_totalHeap:function(){

        return this.mem_totalHeap;
    },
    getMem_heapUsed:function(){

        return this.mem_heapUsed;
    },
    getMem_totalForCurrentProcess:function(){

        return this.mem_totalForCurrentProcess;
    },
    getMem_totalOnV8EngineUsing:function(){

        return this.mem_totalOnV8EngineUsing;
    },
    getMem_usedMemRate:function(){

        return this.mem_usedMemRate;
    },
    getCpuArch:function(){

        return this.cpuArch;
    },
    getCpuInfo:function(){

        return this.cpuInfo;
    },
    getFreemem:function(){

        return this.freemem;
    },
    getHostName:function(){

        return this.hostName;
    },
    getLoadAvg:function(){

        return this.loadAvg;
    },
    getNetworkInterface:function(){

        return this.networkInterface;
    },
    getPlatformtype:function(){

        return this.platformtype;
    },
    getPlatformVersion:function(){

        return this.platformVersion;
    },
    getOsTempDir:function(){

        return this.osTempDir;
    },
    getTotalMemory:function(){

        return this.totalMemory;
    },
    getOsType:function(){

        return this.osType;
    },
    getNodeNormalRunedTime:function(){

        return this.nodeNormalRunedTime;
    }
    
};


module.exports = unitNodeRelation;