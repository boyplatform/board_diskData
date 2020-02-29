'use strict'
function OperationLogSummarySha(){

         this.shaCheckId=undefined;
         this.latestCheckOperationSha=undefined;
         this.createTime=undefined;
         this.updateTime=undefined;
         this.isConfirmedByMaster=undefined;
         this.notMatchedCount=undefined;
         this.shaCheckGuid=undefined;
         this.isActive=undefined;
         this.isSendToMaster=undefined;
         this.sendToMasterTime=undefined;
         this.isNeedRestore=undefined;
          
         //non-db saved attri
         this.comeFromCrystalNodeIp=undefined;
         this.isResendReqOrNot=undefined;
         this.replyToCrystalNodePort=conf.platformArch.crystalCluster.defaultTalkingPort;
         this.isResendReqOrNot=undefined;
}


OperationLogSummarySha.prototype.constructor=OperationLogSummarySha;

module.exports = OperationLogSummarySha;