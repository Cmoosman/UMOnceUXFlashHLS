var UMOASAdSlotManager = (function () {

    //Private Variables
    var _adType;
    var _totalAdSlotAds;
    var _totalAdSlotTime;
    var _count = 0;
	var _currentAdState;
	var _currentAd;
	var _currentAdId = 0;
	var _currentAdSlot; 
	var _currentPrerollAdDuration;
	var _currentMidrollAdDuration;
	var _currentAdManager;
	var _hasAdStarted;
	var _adSlotComplete;
	var _midRollStartTime;
	var _midRollEndTime;
	var _postRollStartTime;
	var _postRollEndTime;
	var _currentAdDuration;
	var _currentRunningAdSlotTime = 0;
	var _currentRunningAdTime = 0;
	var _midRollAdOverlayFlag = false;
	var _postRollAdOverlayFlag = false;
	var _formatedMidRollFirstEndDuration;
	var _formatedPostRollFirstEndDuration;
	var _currentAdClickURL;
	var _currentBannerURL;
	var _firstQuartile;
	var _midPoint;
	var _thirdQuartile;
	var _complete;
	var _trackingURL;
	var _currentQuartile;
	var _adPercentageComplete = 0;
	var _timeout;
	var _adCountDownTimer;
	var previousAdId = 0; 
					
    //Private Methods
   	var adTimer;
   	var updateCurrentAdId;
   	var handleAdCountDownDisplay;
   	var handleCompanionBanners;
   	var getAdSlotTimePercentageComplete;
   	
	
    return {

        //Public Variables
        adType: _adType,
        totalAdSlotAds: _totalAdSlotAds,
        totalAdSlotTime: _totalAdSlotTime,
        currentAdManager: _currentAdManager,
	    currentAdState: _currentAdState,
	    currentAd: _currentAd,
	    currentAdId: _currentAdId,
		currentAdSlot: _currentAdSlot, 
		hasAdStarted: _hasAdStarted, 
		midRollStartTime: _midRollStartTime,
		midRollEndTime: _midRollEndTime,
		postRollStartTime: _postRollStartTime,
		postRollEndTime: _postRollEndTime,
	    
        //Public Methods
        
        /**
		 * Ad slot configuration
		 * 
		 * We need to setup ad slots for pre/mid/post roll ads that can handle multiple ads per ad slot
		 * 
		 * @adtype : type of ad were expecting preroll/midroll/postroll
		 *
		 * @totalAdSlotAds : total number of ads in each ad slot
		 * 
		 * @currentTime : current playback time
		 * 
		 * @totalAdSlotTime : total time of all ads in the ad slot
		 * 
		 * @midRollStartTime : actual start time for the midroll ad slot
		 * 
		 * @postRollStartTime : actual start time for the postroll ad slot
		 * 
		 * @currentAdManager : current ad manager array
		 * 
		 * @currentAdState : boolean that signals the player is in an ad play state
		 * 
		 * @hasAdStarted : boolean that signals current ad is started
		 * 
		 * 
		 */
		AdSlotConfiguration: function(adBreakNodes, currentRawTime, adtype, totalAdSlotAds, currentTime, totalAdSlotTime, midRollStartTime, midRollEndTime, postRollStartTime, postRollEndTime, currentAdManager, currentAdState, hasAdStarted){
			
			//set vars for ad slot configuration
			_adType = adtype;
			_totalAdSlotAds = totalAdSlotAds;
			_totalAdSlotTime = totalAdSlotTime;
			_currentAdState = currentAdState;
			_currentAdManager = currentAdManager;
			_hasAdStarted = hasAdStarted;
			_midRollStartTime = midRollStartTime;
			_midRollEndTime = midRollEndTime;
			_postRollStartTime = postRollStartTime;
			_postRollEndTime = postRollEndTime;
			
			
			switch(adtype){
				case "preroll":
					
					//set preroll ad slot window 
					if(currentTime <= totalAdSlotTime){
						
						//sets adSlotComplete true and resets the current ad id
						_adSlotComplete = false;							
						UMOASAdSlotManager.updateCurrentAdId();
						
						//sets current ad slot ad start time
						var adStartTime = UMOASTimeLineManager.preRollStartTimes["prerollSlot" + _currentAdId + "StartTime"];
						
						if(_currentAdId == _currentAdManager[0].adNumber){
							
							_adPercentageComplete = UMOASAdSlotManager.getAdSlotTimePercentageComplete(adStartTime);
							UMOASAdSlotManager.fireQuartileBeacons(UMOASUtilsManager.getRawTime(currentTime), _adPercentageComplete);
							
						}
						else{
							
							_adPercentageComplete = UMOASAdSlotManager.getAdSlotTimePercentageComplete(adStartTime);
							UMOASAdSlotManager.fireQuartileBeacons(UMOASUtilsManager.getRawTime(currentTime), _adPercentageComplete);
						}
					}
					
				break;
				case "midroll":
					
					//set midroll ad slot window 
					if(currentTime >= midRollStartTime){
						
						//sets adSlotComplete true and resets the current ad id
						_adSlotComplete = true;
						UMOASAdSlotManager.updateCurrentAdId();
						
						//sets current ad slot ad start time
						var adStartTime = UMOASTimeLineManager.midRollStartTimes["midrollSlot" + _currentAdId + "StartTime"];
						
						if(_currentAdId == _currentAdManager[0].adNumber){
							
							_adPercentageComplete = UMOASAdSlotManager.getAdSlotTimePercentageComplete(adStartTime);
							UMOASAdSlotManager.fireQuartileBeacons(UMOASUtilsManager.getRawTime(currentTime), _adPercentageComplete);
							
						}
						else{
							
							_adPercentageComplete = UMOASAdSlotManager.getAdSlotTimePercentageComplete(adStartTime);
							UMOASAdSlotManager.fireQuartileBeacons(UMOASUtilsManager.getRawTime(currentTime), _adPercentageComplete);
						}
					}
					
				break;
				case "postroll":
					
					//sets adSlotComplete true and resets the current ad id
					_adSlotComplete = true;
					UMOASAdSlotManager.updateCurrentAdId();
					
					//sets current ad slot ad start time
					var adStartTime = UMOASTimeLineManager.postRollStartTimes["postrollSlot" + _currentAdId + "StartTime"];
						
					//set postroll ad slot window 
					if(currentTime >= postRollStartTime){
						
						if(_currentAdId == _currentAdManager[0].adNumber){
							
							_adPercentageComplete = UMOASAdSlotManager.getAdSlotTimePercentageComplete(adStartTime);
							UMOASAdSlotManager.fireQuartileBeacons(UMOASUtilsManager.getRawTime(currentTime), _adPercentageComplete);
							
						}	
						else{
							
							_adPercentageComplete = UMOASAdSlotManager.getAdSlotTimePercentageComplete(adStartTime);
							UMOASAdSlotManager.fireQuartileBeacons(UMOASUtilsManager.getRawTime(currentTime), _adPercentageComplete);
						}
					}
					
				break;
				default:
				
				break;
			}
        
		},

        //=======================================Utility methods================================================//

		 /**
		 * Update the current ad ID per ad slot
		 * 
		 * We have to account for multiple ads in each of the ad slots pre/mid/post
		 *
		 * 
		 */
		updateCurrentAdId: function(){
			
			
			//set current ad id
			if(currentTime <= _totalAdSlotTime && _hasAdStarted == true && _adSlotComplete == false){
				
				if(adType == "preroll" && currentTime <= _currentAdManager[0].duration){
					
					//set the current ad ID and the current ad duration
					_currentAdId = _currentAdManager[0].adNumber	
					_currentAdDuration = _currentAdManager[0].duration;
					
					//show/hide ad overlay counter
					UMOASAdSlotManager.handleAdCountDownDisplay();
					
				}
				else{
					
					//loop over totalAdSlots array to get the next ad slot
					for(var c=0; c <_totalAdSlotAds; c++){
						
						var currentAdIdNumber = parseInt(_currentAdId);	
						var currentAdSlotNumber = c; 	
						if(currentAdSlotNumber > 0){
							
							//set the current ad ID and the current ad duration
							_currentAdId = _currentAdManager[c].adNumber;
							_currentAdDuration = _currentAdManager[c].duration;
							
							//show/hide ad overlay counter
							UMOASAdSlotManager.handleAdCountDownDisplay();
							break;
						}
					}
					
				}
			}
			else if(currentTime >= _midRollStartTime && _adSlotComplete == true && currentTime < _postRollStartTime){
				
				//we need to get the end time of the first midroll ad if the ad slot has multiple ads
				var midRollFirstAd = UMOASUtilsManager.getRawTime(_currentAdManager[0].duration);
				var midRollStartTime = UMOASUtilsManager.getRawTime(_midRollStartTime);
				var rawMidRollFirstEndDuration = midRollStartTime + midRollFirstAd;
				_formatedMidRollFirstEndDuration = UMOASUtilsManager.formatTime(rawMidRollFirstEndDuration);
				
				//set current ad id
				if(adType == "midroll" && currentTime <= _formatedMidRollFirstEndDuration){
					
					//set the current ad ID and the current ad duration
					_currentAdId = _currentAdManager[0].adNumber	
					_currentAdDuration = _currentAdManager[0].duration;
					
					//show/hide ad overlay counter
					UMOASAdSlotManager.handleAdCountDownDisplay();
				}
				else{
					
					//loop over totalAdSlots array to get the next ad slot
					for(var b = 0; b < _totalAdSlotAds; b++){
						
						var currentAdSlotNumber = b; 	
						if(currentAdSlotNumber > 0){
							
							//set the current ad ID and the current ad duration
							_currentAdId = _currentAdManager[b].adNumber;
							_currentAdDuration = _currentAdManager[b].duration;
							
							//show/hide ad overlay counter
							UMOASAdSlotManager.handleAdCountDownDisplay();
							break;
						}
					}
					
				}
			}	
			else if(currentTime >= _postRollStartTime && _adSlotComplete == true){
				
				//we need to get the end time of the first postroll ad if the ad slot has multiple ads
 				var postRollFirstAd = UMOASUtilsManager.getRawTime(_currentAdManager[0].duration);
				var postRollStartTime = UMOASUtilsManager.getRawTime(formattedPostRollStartTime);
				var rawPostRollFirstEndDuration = postRollFirstAd + postRollStartTime;
				_formatedPostRollFirstEndDuration = UMOASUtilsManager.formatTime(rawPostRollFirstEndDuration);
				
				//set current ad id
				if(adType == "postroll" && currentTime <= _formatedPostRollFirstEndDuration){
					
					//set the current ad ID and the current ad duration
					_currentAdId = _currentAdManager[0].adNumber	
					_currentAdDuration = _currentAdManager[0].duration;
					
					//show/hide ad overlay counter
					UMOASAdSlotManager.handleAdCountDownDisplay();
				}
				else{
					
					//loop over totalAdSlots array to get the next ad slot
					for(var a = 0; a < _totalAdSlotAds; a++){
						
						var currentAdIdNumber = parseInt(_currentAdId);	
						var currentAdSlotNumber = a; 
						if(currentAdSlotNumber > 0){
							
							//set the current ad ID and the current ad duration
							_currentAdId = _currentAdManager[a].adNumber;
							_currentAdDuration = _currentAdManager[a].duration;
							
							//show/hide ad overlay counter
							UMOASAdSlotManager.handleAdCountDownDisplay();
							break;
						}
					}
				}			
			}
		},
		
		 /**
		 * Handle the UI display of the ad overy count down
		 * 
		 * We have to account for multiple ads in each of the ad slots pre/mid/post
		 *
		 */
		handleAdCountDownDisplay: function(){
			
			//we have to reset the _currentRunningAdTime = 0 at the start of each ad slot
			if(currentTime >= _midRollStartTime && _midRollAdOverlayFlag == false){
				
				//use the _midRollAdOverlayFlag to make sure we dont fire duplicate start events
				if(currentTime < _midRollEndTime && _midRollAdOverlayFlag == false){
					_currentRunningAdTime = 0;
					_midRollAdOverlayFlag = true;	
				}
				
			}
			
			//we have to reset the _currentRunningAdTime = 0 at the start of each ad slot
			if(currentTime >= _postRollStartTime && _postRollAdOverlayFlag == false){
				
				//use the _postRollAdOverlayFlag to make sure we dont fire duplicate start events
				if(currentTime < _postRollEndTime && _postRollAdOverlayFlag == false){
					_currentRunningAdTime = 0;
					_postRollAdOverlayFlag = true;	
				}
				
			}
			
			//convert formated time so we can use it in our interval timer
			var rawAdTime = UMOASUtilsManager.getRawTime(_currentAdDuration);
			var adSlotPercentageComplete = 	UMOASAdSlotManager.getAdSlotTimePercentageComplete();	
	
			if(_currentRunningAdTime == 0){
				
				_currentRunningAdTime = rawAdTime;
				_adCountDownTimer = setInterval(UMOASAdSlotManager.adCountdown,1000);
				
			    //Ad quartile flags
				_firstQuartile = false;
				_midPoint = false;
				_thirdQuartile = false;
				_complete = false;
			    
			}
			    
			  
		   	
			
			
			//handles loading the companion banner with click through URL
			UMOASAdSlotManager.handleCompanionBanners();
		},
		
		 /**
		 * Handle the UI display of the ad count down timer
		 *
		 * 
		 */
		adCountdown: function(){
			
			_currentRunningAdTime = _currentRunningAdTime - 1;
			
			//handles UI for ad messaging overlay
			var adOverlayMessage = 	"Ad slot: " + _currentAdId + " has " + _currentRunningAdTime + " seconds left.";
			$("#adOverlay").html(adOverlayMessage);	
		},
		
		 /**
		 * Handle the UI display of the companion banner ads
		 * 
		 * We have to account for multiple ads in each of the ad slots pre/mid/post
		 *
		 * 
		 */
		handleCompanionBanners: function(){
			
			//clear the preroll banner
        	$("#bannerContainer").html("");
        	
  			//loop over the adBreakCompanionBanners array to get the banner and click through URL					
			for(var m = 0; m < adBreakCompanionBanners.length; m++){
				if(adBreakCompanionBanners[m].adBreakID == _currentAdId){
					_currentAdClickURL = adBreakCompanionBanners[m].companionClickThrough;
					_currentBannerURL = adBreakCompanionBanners[m].staticResource;
					break;		
				}
			}	
			
			$("#umvideo").click(function(){
			    //window.location = _currentAdClickURL;
			    window.open(_currentAdClickURL, "_blank");
			});
			   
			//Set up preroll ad slot configuration for companion banners
			var companionBannerTag = "";
    		companionBannerTag += '<a href="' + _currentAdClickURL +'" target="_blank"><img id="companionBanner"  width="300" height="250" alt="" src="' + _currentBannerURL +'"/></a>';
    		$("#bannerContainer").html(companionBannerTag);	
		    
		},
		
		
		/**
		 * Gets the coresponding quartile tracking url
		 * 
		 * 
		 * 
		 */
		getCurrentQuartileTrackingURL: function(_currentAdId, _currentQuartile){
			
			var currentBeaconURL;
			
			for(var r=0; r < adBreakTracking.length; r++){
				
				if(adBreakTracking[r].adBreakID == _currentAdId){
					
					if(_currentQuartile == "firstQuartile"){
						currentBeaconURL = adBreakTracking[r].firstQuartile;
						if(currentBeaconURL){
							break;	
						}
					}
					else if(_currentQuartile == "midpoint"){
						currentBeaconURL = adBreakTracking[r].midpoint;
						if(currentBeaconURL){
							break;	
						}
					}
					else if(_currentQuartile == "thirdQuartile"){
						currentBeaconURL = adBreakTracking[r].thirdQuartile;
						if(currentBeaconURL){
							break;	
						}
					}
					else if(_currentQuartile == "complete"){
						currentBeaconURL = adBreakTracking[r].complete;
						if(currentBeaconURL){
							break;	
						}
					}
					else{
						currentBeaconURL = "";
						if(currentBeaconURL){
							break;	
						}
					}
				}
				
			}    
            return currentBeaconURL;
		},
		
		/**
		 * Fires tracking beacons for each ad slot during playback 
		 * 
		 * 
		 */	
		fireQuartileBeacons: function(time, trackingCompleteObject){
		
			if(time >= trackingCompleteObject.twentyFive && _firstQuartile == false){
				_trackingURL = UMOASAdSlotManager.getCurrentQuartileTrackingURL(_currentAdId, "firstQuartile");
				UMOASBeaconManager.beaconEventHandler(_currentAdId, currentRawTime, _trackingURL);
				_firstQuartile = true;
			}
			else if(time >= trackingCompleteObject.fifty && _midPoint == false){
				_trackingURL = UMOASAdSlotManager.getCurrentQuartileTrackingURL(_currentAdId, "midpoint");
				UMOASBeaconManager.beaconEventHandler(_currentAdId, currentRawTime, _trackingURL);
				_midPoint = true;
			}
			else if(time >= trackingCompleteObject.seventyFive && _thirdQuartile == false){
				_trackingURL = UMOASAdSlotManager.getCurrentQuartileTrackingURL(_currentAdId, "thirdQuartile");
				UMOASBeaconManager.beaconEventHandler(_currentAdId, currentRawTime, _trackingURL);
				_thirdQuartile = true;
			}
			else if(time >= trackingCompleteObject.oneHundred && _complete == false){
				_trackingURL = UMOASAdSlotManager.getCurrentQuartileTrackingURL(_currentAdId, "complete"); 
				UMOASBeaconManager.beaconEventHandler(_currentAdId, currentRawTime, _trackingURL);
				previousAdId = _currentAdId;
				_complete = true;
				_timeout = setTimeout(UMOASAdSlotManager.flagReset,1000);
			}	
		},
		
		/**
		 * Resets quartile flags for each ad slot during playback 
		 * 
		 * 
		 */
		flagReset: function(){
			//Ad quartile flags
			_firstQuartile = false;
			_midPoint = false;
			_thirdQuartile = false;
			_complete = false;
			clearTimeout(_timeout);
			clearInterval(_adCountDownTimer);
			_currentRunningAdTime = 0;
		},
		
		/**
		 * Gets the percentage complete for each ad slot during playback 
		 * 
		 * @adStartTime : is the current playing ad start time
		 * 
		 */
		getAdSlotTimePercentageComplete: function(adStartTime){
			
	        var currentAdSlotDuration = UMOASUtilsManager.getRawTime(_currentAdDuration); //current ad slot duration
    
        	var trackingStack = {}
           	trackingStack.twentyFive = Math.round(currentAdSlotDuration * 0.25) + adStartTime;
           	trackingStack.fifty = Math.round(currentAdSlotDuration * 0.50) + adStartTime;
           	trackingStack.seventyFive = Math.round(currentAdSlotDuration * 0.75) + adStartTime;
           	trackingStack.oneHundred = Math.round(currentAdSlotDuration * 1) + adStartTime;
           	
           	 return trackingStack;
           	 
		}
    };

})();


     