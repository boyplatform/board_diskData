'use strict'
var validator=require('validator');
 
var diskDataCommon=require('./boyDiskDataCommon.js');
var QueueValidator=(function(){
    
    
    
    
    return function() {
         
        this.InputValidator=function(body,router){
            
            let validatorResult=[];
            switch(router)
            {
              case '/crystalTalkingReceiver':
                //结构验证
                if(body.type===undefined)
                {
                    validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                }else{
                    if(body.type!="opGetReqFromSubNode"&&body.type!="opMasterConfirmResult"&&body.type!="getWopMessageStartForMockTest"&&body.type!="opGetLogSummaryShaFromSubNode"&&body.type!="opLogSummaryShaConfirmResult"&&body.type!="opExportOperationLog")
                    {
                        validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    }
                    else if(body.type==="getWopMessageStartForMockTest"&&(body.message===undefined||body.targetDbName===undefined||body.appId===undefined||body.appName===undefined||body.appGuid===undefined||body.reqStorageClusterType===undefined)){

                        validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    }
                    else if(body.type==="opGetReqFromSubNode"&&(body.reqGuid===undefined||body.appId===undefined||body.appName===undefined||body.appGuid===undefined||body.userId===undefined||body.url===undefined||body.reqStorageClusterType===undefined||body.isActive===undefined||body.userGuid===undefined||body.writeSqlSha===undefined||body.writeSql===undefined))
                    {
                        validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    
                    }else if(body.type==="opMasterConfirmResult"&&(body.reqGuid===undefined||body.isConfirmed===undefined)){
                        
                        validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    
                    }
                    else if(body.type==="opGetLogSummaryShaFromSubNode"&&(body.shaCheckGuid===undefined||body.latestCheckOperationSha===undefined||body.createTime===undefined||body.isResendReqOrNot===undefined)){
                        
                        validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    
                    }else if(body.type==="opLogSummaryShaConfirmResult"&&(body.shaCheckGuid===undefined||body.isConfirmed===undefined)){
                        
                        validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    
                    }
                    else if(body.type==="opExportOperationLog"&&(body.checkTimePoint===undefined)){
                        
                        validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                    
                    }
                    else{
                        validatorResult.push({Result:true});
                    }
                }
                break;
              case '/readMe':
                //结构验证
                if(body.type===undefined)
                {
                    validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                }else{
                    validatorResult.push({Result:true});
                }
                break;
              case '/getDiskData':
                if(body.querySql===undefined)
                {
                    validatorResult.push({RequestResponseId:diskDataCommon.getUUID(),Result:false,Description:'报文结构错误,请检查核对!'})
                }else{
                    validatorResult.push({Result:true});
                }
            }

            return validatorResult[0];
        }


    
    }
})();

module.exports=QueueValidator;