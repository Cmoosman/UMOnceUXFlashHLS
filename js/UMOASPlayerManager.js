var UMOASPlayerManager = (function () {

    //Private Variables
	var _preRollAdManager = [];
	var _preRollRawCount = 0;
	var _currentPreRollAdSlot = 0; 
	var _currentMidRollAdSlot = 0;
	var _currentPostRollAdSlot = 0;
	var _currentAdID = 0;
	var _currentAdClickURL;
	var _currentBannerURL;
	var _currentAdBreakId = 0;
	var _postRollSlotOne = false;

    //Private Methods
   	var getRawTime;
   	var formatTime;
   	var clearDataProviders;
   	var adTimer;
   	var clearPrerollDataProviders;
   	var clearMidrollDataProviders;
	
    return {

        //Public Variables
	    preRollAdManager: _preRollAdManager,
	    currentAdID: _currentAdID,
		preRollRawCount: _preRollRawCount,
		currentPreRollAdSlot: _currentPreRollAdSlot,
		currentMidRollAdSlot: _currentMidRollAdSlot,
		currentPostRollAdSlot: _currentPostRollAdSlot,
        
        //Public Methods
        
        /**
		 * Sets the player configuration for TOTAL preroll duration
		 * 
		 * @totalPrerollTime : TOTAL duration of all preroll ads
		 * 
		 * @currentTime : current stream time
		 * 
		 * @preRollAdManager : object that contains all preroll ad data for player configuration
		 * 
		 */
		SetPreRollConfig: function(totalPrerollTime, currentTime, preRollAdManager){

			//clear the preroll banner
        	$("#bannerContainer").html("");
        	
		    for (var j = 0; j < preRollAdManager.length; j++)
		    {
		    	if(totalPrerollTime >= currentTime){
		    		
		    		for(var k=0; k<preRollAdManager.length; k++){
						
						for(var c=0; c<adBreakCompanionBanners.length; c++){
							if(adBreakCompanionBanners[c].adBreakID == 0){
								for(var d=0; d< adBreakCompanionBanners.length; d++){
									if(adBreakCompanionBanners[d].type == "preroll" && adBreakCompanionBanners[d].adBreakID == _currentAdID){
										_currentAdClickURL = adBreakCompanionBanners[d].companionClickThrough;
										_currentBannerURL = adBreakCompanionBanners[d].staticResource;
										break;		
									}
								}	
							}
							break;
						}
						
						//Set up preroll ad slot configuration for companion banners
						var preRollCompanionBannerTag = "";
                		preRollCompanionBannerTag += '<a href="' + _currentAdClickURL +'"><img id="companionBanner"  width="300" height="250" alt="" src="' + _currentBannerURL +'"/></a>';
                		$("#bannerContainer").html(preRollCompanionBannerTag);	
						
					}
		    		
		    	}
				 
            }
            
        
		},
		
		/**
		 * Sets the player configuration for TOTAL midroll duration
		 *
		 *@formattedMidRollStartTime : midroll start time
		 * 
		 *@formattedMidRollEndTime : midroll end time
		 * 
		 *@currentTime : current stream time
		 * 
		 *@midRollAdManager : object that contains all midroll ad data for player configuration
		 *
		 */
		SetMidRollConfig: function(totalMidrollTime, formattedMidRollStartTime, formattedMidRollEndTime, currentTime, midRollAdManager){
        	
        	if(preRollAdManager.length > 0){
        		//clear preroll ad configs
        		UMOASPlayerManager.clearPrerollDataProviders();
        	}
        	
        	//clear the preroll banner
        	$("#bannerContainer").html("");
        	
        	//loop over midrollmanager to set player midroll config options
        	for (var a = 0; a < midRollAdManager.length; a++)
		    {
		    	if(currentTime <= formattedMidRollEndTime){
	    		
		    		for(var b=0; b<midRollAdManager.length; b++){
					
							for(var c=0; c<adBreakCompanionBanners.length; c++){
								if(adBreakCompanionBanners[c].type != "preroll" || adBreakCompanionBanners[c].type != "postroll"){
									for(var d=0; d< adBreakCompanionBanners.length; d++){
										if(adBreakCompanionBanners[d].type == "midroll"){
											_currentAdClickURL = adBreakCompanionBanners[d].companionClickThrough;
											_currentBannerURL = adBreakCompanionBanners[d].staticResource;
											break;		
										}
									}	
								}
								break;
							}
						
						}	
						
						//Set up preroll ad slot configuration for companion banners
						var midRollCompanionBannerTag = "";
                		midRollCompanionBannerTag += '<a href="' + _currentAdClickURL +'"><img id="companionBanner"  width="300" height="250" alt="" src="' + _currentBannerURL +'"/></a>';
                		$("#bannerContainer").html(midRollCompanionBannerTag);	
					}
			}
		
		},
		
		/**
		 * Sets the player configuration for TOTAL postroll duration
		 *
		 *@formattedPostRollStartTime : postroll start time
		 * 
		 *@currentTime : current stream time
		 * 
		 *@postRollAdManager : object that contains all postroll ad data for player configuration
		 *
		 */
		SetPostRollConfig: function(formattedPostRollStartTime, currentTime, assetDuration, postRollAdManager){
        	
        	if(midRollAdManager.length > 0){
        		//clear preroll ad configs
        		UMOASPlayerManager.clearMidrollDataProviders();
        	}
        	
        	//clear the preroll banner
        	$("#bannerContainer").html("");
        	
        	//loop over midrollmanager to set player midroll config options
        	for (var a = 0; a < postRollAdManager.length; a++)
		    {
		    	if(currentTime >= formattedPostRollStartTime){
	    		
		    		for(var b=0; b<postRollAdManager.length; b++){
							
							for(var c=0; c<adBreakCompanionBanners.length; c++){
								if(adBreakCompanionBanners[c].type == "preroll" || adBreakCompanionBanners[c].type == "midroll"){
									for(var d=0; d< adBreakCompanionBanners.length; d++){
										if(adBreakCompanionBanners[d].type == "postroll"){
											_currentAdClickURL = adBreakCompanionBanners[d].companionClickThrough;
											_currentBannerURL = adBreakCompanionBanners[d].staticResource;
											break;		
										}
									}	
								}
								break;
							}
						
						}	
						
						//Set up preroll ad slot configuration for companion banners
						var postRollCompanionBannerTag = "";
                		postRollCompanionBannerTag += '<a href="' + _currentAdClickURL +'"><img id="companionBanner"  width="300" height="250" alt="" src="' + _currentBannerURL +'"/></a>';
                		$("#bannerContainer").html(postRollCompanionBannerTag);	
					}
			}
        
		},


        //=======================================Utility methods================================================//

		/**
		 * Clears all data providers 
		 * 
		 * Should be called on load of new OAS URL
		 * 
		 */
        clearDataProviders: function () {
            
            _adBreakNodes = [];
    		_adBreakTracking = [];
   			_adBreakCompanionBanners = [];
        },
        
       clearPrerollDataProviders: function () {
            
            _preRollAdManager = [];
			preRollAdManager = _preRollAdManager;
			_preRollRawCount = 0;
			_currentPreRollAdSlot = 0; 
			_currentAdID = 0;
        },
        
         clearMidrollDataProviders: function () {
            
            _midRollAdManager = [];
			midRollAdManager = _midRollAdManager;
			_currentMidRollAdSlot = 0; 
			_currentAdBreakId = 0;
			_currentAdID = 0;
        },
        
        getRawTime: function(seconds) {
		  
			var b = seconds.split(/\D/);
			var secTime = (+b[0])*60*60 + (+b[1])*60 + (+b[2]); 
			return secTime;
		},
		
		formatTime: function(secs) {
		   var hours = Math.floor(secs / (60 * 60));

		    var divisor_for_minutes = secs % (60 * 60);
		    var minutes = Math.floor(divisor_for_minutes / 60);
		
		    var divisor_for_seconds = divisor_for_minutes % 60;
		    var seconds = Math.ceil(divisor_for_seconds);
		
			// This line gives you 12-hour (not 24) time
			if (hours > 12) {hours = hours - 12;}
			
			// These lines ensure you have two-digits
			if (hours < 10) {hours = "0"+hours;}
			if (minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			
			// This formats your string to HH:MM:SS
			var t = hours+":"+minutes+":"+seconds;
		
		    return t;
		},
		
		adTimer: function()
		{
		  _preRollRawCount = _preRollRawCount-1;
		  if (_preRollRawCount <= 0)
		  {
		     clearInterval(counter);
		     //counter ended, do something here
		     return;
		  }
		

		}

    };

})();


     