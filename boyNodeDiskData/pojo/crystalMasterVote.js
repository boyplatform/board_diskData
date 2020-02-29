'use strict'
function crystalMasterVote(crystalNodeId,crystalNodeGuid,lastVoteMeNodesIps,lastVotePerformanceDump,
    lastVoteCount,createTime,crystalNodeIp,crystalNodePort,interactProtocolType){
    
        this.crystalNodeId=crystalNodeId;
        this.crystalNodeGuid=crystalNodeGuid;
        this.lastVoteMeNodesIps=lastVoteMeNodesIps;
        this.lastVotePerformanceDump=lastVotePerformanceDump;
        this.lastVoteCount=lastVoteCount;
        this.createTime=createTime;
        this.crystalNodeIp=crystalNodeIp;
        this.crystalNodePort=crystalNodePort;
        this.interactProtocolType=interactProtocolType;

}

crystalMasterVote.prototype={
    constructor: crystalMasterVote,
    getCrystalNodeId: function(){

        return this.crystalNodeId;
    },
    getCrystalNodeGuid:function(){

        return this.crystalNodeGuid;
    },
    getLastVoteMeNodesIps:function(){

        return this.lastVoteMeNodesIps;
    },
    getLastVotePerformanceDump:function(){

        return this.lastVotePerformanceDump;
    },
    getLastVoteCount:function(){

        return this.lastVoteCount;
    },
    getCreateTime:function(){

        return this.createTime;
    },
    getCrystalNodeIp:function(){

        return this.crystalNodeIp;
    },
    getCrystalNodePort:function(){

        return this.crystalNodePort;
    },
    getInteractProtocolType:function(){

        return this.interactProtocolType;
    }
};

module.exports = crystalMasterVote;