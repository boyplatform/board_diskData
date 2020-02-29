'use strict'
var CrystalClusterInfoRecord=require("../../../Dao/crystalClusterInfoRecord")
var CrystalMasterVote=require('../../../pojo/crystalMasterVote');

function Interact(){
    
    if(this.crystalClusterInfoRecord===undefined){
        this.crystalClusterInfoRecord=new CrystalClusterInfoRecord();
     }
     if(this.crystalMasterVote===undefined){
        this.crystalMasterVote=new CrystalMasterVote();
     }
    
 
};

Interact.prototype.constructor=Interact;

//Crystal cluster master timely self nature selection/vote result seek
Interact.prototype.timelyNodeSelectionVoteResultSeek=function(callback){

    if(this.crystalClusterInfoRecord===undefined){
        this.crystalClusterInfoRecord=new CrystalClusterInfoRecord();
     }
     
    //return back latest self nature selection vote result.
    this.crystalClusterInfoRecord.crystalMasterVoteSelect("1","",[""],"order by lastVoteCount desc",function(rows){
        callback(rows);
    });
    
};



//seek current master node info
Interact.prototype.seekMasterNodeVoteResult=function(callback){
    
    if(this.crystalClusterInfoRecord===undefined){
        this.crystalClusterInfoRecord=new CrystalClusterInfoRecord();
     }
    this.crystalClusterInfoRecord.crystalClusterBlockSelect("1","where crstalNodeRole=0",[""],"",function(rows){

        callback(rows[0]);
    });
}


module.exports=Interact;