var UMOASAdManager = (function () {

    //Private Variables
	var _preRollAdManager = [];
	var _midRollAdManager = [];
	var _postRollAdManager = [];
	var _totalNumberPrerollAds;
	var _totalPrerollTime;
	var _totalPostrollTime;
	var _totalMidrollTime;
	var _prerollAd;
	var _midrollAd;
	var _postrollAd;

    //Private Methods
	
    return {

        //Public Variables
	    preRollAdManager: _preRollAdManager,
		midRollAdManager: _midRollAdManager,
		postRollAdManager: _postRollAdManager,
		totalPrerollTime: _totalPrerollTime,
		totalPostrollTime: _totalPostrollTime,
		totalMidrollTime: _totalMidrollTime,
		
        //Public Methods
        
        /**
		 * Gets the total ad slot time and checks for multiple ads
		 * 
		 * @adBreakNodes : an array of all the ad breaks 
		 * 
		 * @adBreakNodes : properties
		 * 	 breakType :  generally linear
	     *   breakId : preroll/midroll/postroll
	     *   timeOffset : vmap slot identifier
	     *   adDuration : actual running time of ad
		 *
		 */
		GetTotalAdSlotProperties: function(adBreakNodes){
        	   

		    for (var j = 0; j < adBreakNodes.length; j++)
		    {
		    	
				if(adBreakNodes[j].timeOffset == "start"){
					
					var adDuration = adBreakNodes[j].adDuration;
					var rawTime = UMOASUtilsManager.getRawTime(adDuration);
					
					if(_totalPrerollTime){
						_totalPrerollTime = _totalPrerollTime + rawTime;
					}
					else{
						_totalPrerollTime = rawTime;
					}
					_prerollAd = {};							
					_prerollAd["adNumber"] = adBreakNodes[j].breakId;
					_prerollAd["duration"] = adDuration;
					_prerollAd["type"] = "preroll";
					
					_totalNumberPrerollAds = j;
					
					_preRollAdManager.push(_prerollAd);
				}
				else if(adBreakNodes[j].timeOffset == "end"){
					
					var adDuration = adBreakNodes[j].adDuration;
					var rawTime = UMOASUtilsManager.getRawTime(adDuration);
					
					if(_totalPostrollTime){
						_totalPostrollTime = _totalPostrollTime + rawTime;
					}
					else{
						_totalPostrollTime = rawTime;
					}
					
					_postrollAd = {};
					_postrollAd["adNumber"] = adBreakNodes[j].breakId;
					_postrollAd["duration"] = adBreakNodes[j].adDuration;
					_postrollAd["type"] = "postroll";
					
					_postRollAdManager.push(_postrollAd);
				}
				else{
					
					var adDuration = adBreakNodes[j].timeOffset;
					var rawTime = UMOASUtilsManager.getRawTime(adDuration);
					
					if(_totalMidrollTime){
						_totalMidrollTime = _totalMidrollTime + rawTime;
					}
					else{
						_totalMidrollTime = rawTime;
					}
					
					_midrollAd = {};
					_midrollAd["adNumber"] = adBreakNodes[j].breakId;
					_midrollAd["duration"] = adBreakNodes[j].adDuration;
					_midrollAd["timeOffset"] = adBreakNodes[j].timeOffset;
					_midrollAd["type"] = "midroll";
					
					_midRollAdManager.push(_midrollAd);
				}   
            }
            
           	totalPrerollTime = UMOASUtilsManager.formatTime(_totalPrerollTime);
            totalMidrollTime = UMOASUtilsManager.formatTime(_totalMidrollTime);
            totalPostrollTime = UMOASUtilsManager.formatTime(_totalPostrollTime);
            
		}
    };

})();

// Usage:

/*
* Adds a object to our path dataprovider
*  beaconTemplateData.addPath(id, path);
*
* Updates a object to our path dataprovider
*  beaconTemplateData.createUpdatePath(id, path);
*
* Removes a object to our path dataprovider
*  beaconTemplateData.removePath(id, path);
*
* Updates a object to our querystring dataprovider
*   beaconTemplateData.createUpdateQueryStringKVP(keyid, keyname, keyvalue);
*
* Removes a object to our querystring dataprovider
*  beaconTemplateData.removeQueryStringKVP(keyid, keyname, keyvalue);
*
*
*
*/
     