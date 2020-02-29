'use strict'
function crystalClusterBlock(crystalNodeGuid,crystalNodeIp,crystalNodePort,
    interactProtocolType,mem_totalHeap,mem_heapUsed,mem_totalForCurrentProcess,mem_totalOnV8EngineUsing,mem_usedMemRate,cpuArch,cpuInfo,freemem,hostName,loadAvg,
    networkInterface,platformtype,platformVersion,osTempDir,totalMemory,osType,nodeNormalRunedTime,crstalNodeRole){
   
        this.crystalNodeGuid=crystalNodeGuid;
        this.crystalNodeIp=crystalNodeIp;
        this.crystalNodePort=crystalNodePort;
        this.interactProtocolType=interactProtocolType;
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
        this.crstalNodeRole=crstalNodeRole;

}

crystalClusterBlock.prototype={
    constructor: crystalClusterBlock,
    getCrystalNodeGuid:function(){

        return this.crystalNodeGuid;
    },
    getCrystalNodeIp:function(){
        return this.crystalNodeIp;
    },
    getCrystalNodePort:function(){
        return this.crystalNodePort;
    },
    getInteractProtocolType:function(){
        return this.interactProtocolType;
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
    },      
    getCrstalNodeRole:function(){

        return this.crstalNodeRole;
    }


}

module.exports = crystalClusterBlock;