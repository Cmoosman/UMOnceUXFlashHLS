var UMOASTimeLineManager = (function () {

    //Private Variables
	var _prerollSlotTime = 0;
	var _midrollSlotTime = 0;
	var _postrollSlotTime = 0;
	var _preRollStartTimes = {};
	var _midRollStartTimes = {};
	var _postRollStartTimes = {};		
					
    //Private Methods
   	var midRoll0AdStartTime = 0;
	var postRoll0AdStartTime = 0;
    
    return {

        //Public Variables
       	preRollStartTimes: _preRollStartTimes,
       	midRollStartTimes: _midRollStartTimes,
       	postRollStartTimes: _postRollStartTimes,
        
        /**
		 * 
		 * CreateTimelineManager() Builds virtual timeline based on vmap response
		 *
		 * @totalPrerollTime : total duration of the preroll ad slot
		 * 
		 * @totalPostrollTime : total duration of the postroll ad slot
		 * 
		 * @totalMidrollTime : total duration of the midroll ad slot
		 * 
		 * @prerollManager : contains all preroll ad slot data
		 * 
		 * @midrollManager : contains all midroll ad slot data
		 * 
		 * @postrollManager : contains all postroll ad slot data
		 * 
		 * @assetDuration : duration of asset including ads
		 * 
		 * 
		 */
		CreateTimelineManager: function(totalPrerollTime, totalPostrollTime, totalMidrollTime, prerollManager, midrollManager, postrollManager, assetDuration){
			
			//Get preroll info
			if(prerollManager.length > 0){
				
				//Loop over currrent manager to get ad start times
				for(var i=0; i<prerollManager.length; i++){
					
					if(_preRollStartTimes.prerollSlot0StartTime != 0){
						_preRollStartTimes["prerollSlot" + i + "StartTime"] = 0;	
					}
					else{
						_preRollStartTimes["prerollSlot" + i + "StartTime"] = UMOASUtilsManager.getRawTime(prerollManager[i].duration);	
					}
				}
			}		
			
			//Get midroll info
			if(midrollManager.length > 0){
				
				//Loop over currrent manager to get ad start times
				for(var j=0; j<midrollManager.length; j++){
					
					if(midRoll0AdStartTime == 0){
						midRoll0AdStartTime = UMOASUtilsManager.getRawTime(totalPrerollTime) + UMOASUtilsManager.getRawTime(midrollManager[0].timeOffset);	
					}
					var midroleStartAd = midrollManager[0].adNumber; //Need to get the adNumber to set the start ad position for the ad slot
					if(_midRollStartTimes["midrollSlot" + midroleStartAd + "StartTime"] != midRoll0AdStartTime){
						_midRollStartTimes["midrollSlot" + midrollManager[j].adNumber + "StartTime"] = midRoll0AdStartTime;	
					}
					else{
						var st = midRoll0AdStartTime + UMOASUtilsManager.getRawTime(midrollManager[j].duration);
						_midRollStartTimes["midrollSlot" + midrollManager[j].adNumber + "StartTime"] = st;	
					}
				}
			}
			
			//Get postroll info
			if(postrollManager.length > 0){
				
				//Loop over currrent manager to get ad start times
				for(var k=0; k<postrollManager.length; k++){
					
					if(postRoll0AdStartTime == 0){
						postRoll0AdStartTime = UMOASUtilsManager.getRawTime(assetDuration) - UMOASUtilsManager.getRawTime(totalPostrollTime);	
					}
					var postroleStartAd = postrollManager[0].adNumber; //Need to get the adNumber to set the start ad position for the ad slot
					if(_postRollStartTimes["postrollSlot" + postroleStartAd + "StartTime"] != postRoll0AdStartTime){
						_postRollStartTimes["postrollSlot" + postrollManager[k].adNumber + "StartTime"] = postRoll0AdStartTime;	
					}
					else{
						var st = postRoll0AdStartTime + UMOASUtilsManager.getRawTime(postrollManager[k].duration);
						_postRollStartTimes["postrollSlot" + postrollManager[k].adNumber + "StartTime"] = st;	
					}
				}
			}
		}
    };

})();


     