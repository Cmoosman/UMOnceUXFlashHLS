var UMOASBeaconManager = (function () {

    //Private Variables
	var _currentBeaconURL;
	var _firstQuartile = "firstQuartile"; 
	var _value;
					
    //Private Methods
   	
	
    return {

        //Public Variables
	    currentBeaconURL: _currentBeaconURL,
       
        /**
		 * Fires beacon URLs from client
		 * 
		 * @beaconURL : beacon URL for the specific beacon event to be fired
		 *
		 * 
		 */
		beaconEventHandler: function(currentAd, currentTime, currentTrackingURL){
			
			
			_currentBeaconURL = currentTrackingURL;
			var currentRawTime = currentTime;
			var humanReadableTime = UMOASUtilsManager.formatTime(currentTime);
			var playheadTime = currentTime * 1000;
		
			var adBeaconEvent = "Ad with breakId: " + currentAd + "\n" + " Readable play head time: " + humanReadableTime + "\n" + " Beacon fired time (milliseconds): " + currentRawTime + "\n" + " Current play head time (milliseconds): " + playheadTime + "\n" + " Beacon URL: " + _currentBeaconURL; 
			UMOASUtilsManager.writeToEventConsole(adBeaconEvent);
		  	
		  	$.ajax({
                type: 'POST',
                url: _currentBeaconURL,
                success: function (data) {
                    //$("#vmapResponse").text(data);
                   
                }
            });	
            
        
		}

    };

})();


     