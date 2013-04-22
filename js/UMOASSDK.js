var UMOASSDK = (function () {

    //Private Variables
    var _contentOnceURL = [];
    var _adBreakNodes = [];
    var _adBreakTracking = [];
   	var _adBreakCompanionBanners = [];
   	var _externalProvider = [];
   	var _externalProviderSDK = [];
   	var onceURL;
	var adBreaks;
	var adTracking;
	var adBreakBanners;
	var vmap_namespace = "*";

    //Private Methods
   	var formatTime;
   	var clearDataProviders;
	
    return {

        //Public Variables
        contentOnceURL: _contentOnceURL,
        adBreakNodesArray: _adBreakNodes,
        adBreakTracking: _adBreakTracking,
		adBreakCompanionBanners: _adBreakCompanionBanners,
		externalProvider: _externalProvider,
		externalProviderSDK: _externalProviderSDK,
        
        //Public Methods
        
        /**
		 * Gets the companion banner ad for the current ad break inside the <StaticResource> node
		 * 
		 * @id : the id of the current vmap:AdBreak
		 * 
		 * @xml : current vmap:AdBreak xml node and all its children
		 * 
		 * @nodeName : the current node we are looking for to parse <StaticResource>
		 * 
		 */
		GetContentOnceURL: function(xml, nodeName){
        	   
		    var colonIndex = nodeName.indexOf(":");
		    var tag = nodeName.substr(colonIndex + 1);
		    var nodes = xml.getElementsByTagNameNS("*", tag);
		    
		    for (var i = 0; i < nodes.length; i++)
		    {
		    	
				var propertyName = "OnceURL"; 
				var propertyValue = nodes[i].getAttribute('contenturi');
				onceURL = {};
                onceURL[propertyName] = propertyValue;

                _contentOnceURL.push(onceURL);
            }
            
            UMOASSDK.GetAdBreaksNodeName(xml, "vmap:AdBreak");
		},
		
		 /**
		 * Gets the external adprovider <uo:externalAds> node
		 * 
		 * @xml : current vmap:AdBreak xml node and all its children
		 * 
		 * @nodeName : the current node we are looking for to parse <StaticResource>
		 * 
		 */
		GetExternalAdProvider: function(xml, nodeName){
        	   
		    var colonIndex = nodeName.indexOf(":");
		    var tag = nodeName.substr(colonIndex + 1);
		    var nodes = xml.getElementsByTagNameNS("*", tag);
		    
		    for (var i = 0; i < nodes.length; i++)
		    {
		    	
				var propertyName = "ProviderName"; 
				var propertyValue = nodes[i].getAttribute('provider');
				provider = {};
                provider[propertyName] = propertyValue;

                _externalProvider.push(provider);
            }
            
            UMOASSDK.GetExternalProviderSDK(xml, "uo:script");
		},
		
		/**
		 * Gets the external adprovider SDK url inside the <uo:externalAds> node
		 * 
		 * @xml : current vmap:VMAP xml node and all its children
		 * 
		 * @nodeName : the current node we are looking for to parse <vmap:AdBreak>
		 * 
		 */
        GetExternalProviderSDK: function(xml, nodeName){
        	   
		    var colonIndex = nodeName.indexOf(":");
		    var tag = nodeName.substr(colonIndex + 1);
		    var nodes = xml.getElementsByTagNameNS("*", tag);
		    
		    for (var i = 0; i < nodes.length; i++)
		    {
		    	
		      var externalProviderSDKNode = xml.getElementsByTagNameNS('vmap:Extensions', 'script')[i];
			  var externalProviderSDK = externalProviderSDKNode.getAttribute('includeurl');
              _externalProviderSDK.push(adBreaks);
     		
     		}
		},
		
        /**
		 * Gets all ad breaks for each ad break inside the <vmap:VMAP> node
		 * 
		 * @xml : current vmap:VMAP xml node and all its children
		 * 
		 * @nodeName : the current node we are looking for to parse <vmap:AdBreak>
		 * 
		 */
        GetAdBreaksNodeName: function(xml, nodeName){
        	   
		    var colonIndex = nodeName.indexOf(":");
		    var tag = nodeName.substr(colonIndex + 1);
		    var nodes = xml.getElementsByTagNameNS("*", tag);
		    for (var i = 0; i < nodes.length; i++)
		    {
		      
		      var adBreakXML = nodes[i];
		      
		      var currentAdTimeOffset = nodes[i].getAttribute('timeOffset')
		      UMOASSDK.GetAdTrackingNodeName(i, adBreakXML, "Tracking");
		      UMOASSDK.GetCompanionBannerAd(i, currentAdTimeOffset, xml);
		      
		      var adBreakIDNode = xml.getElementsByTagNameNS(vmap_namespace, 'AdSource')[i];
			  var adBreakID = adBreakIDNode.getAttribute('id');
			  
		      var adBreakDuration = xml.getElementsByTagNameNS(vmap_namespace, 'Duration')[i];
			  var rawAdDuration = adBreakDuration.textContent;
			  var rawAdDurationToSlice = rawAdDuration;
			  adDuration = rawAdDurationToSlice.slice(0,8);

        	  if (_adBreakNodes.length <= 0) {
	                adBreaks = {
	                    breakType: nodes[i].getAttribute('breakType'),
	                    breakId: adBreakID,
	                    timeOffset: nodes[i].getAttribute('timeOffset'),
	                    adDuration: adDuration
	                }
	
	                _adBreakNodes.push(adBreaks);
	            }
                else {
                    adBreaks = {
	                    breakType: nodes[i].getAttribute('breakType'),
	                    breakId: adBreakID,
	                    timeOffset: nodes[i].getAttribute('timeOffset'),
	                    adDuration: adDuration
	                }

                    _adBreakNodes.push(adBreaks);
                }
		    }
		},
		
		/**
		 * Gets all tracking beacons for each ad break inside the <TrackingEvents> node
		 * 
		 * @id : the id of the current vmap:AdBreak
		 * 
		 * @xml : current vmap:AdBreak xml node and all its children
		 * 
		 * @nodeName : the current node we are looking for to parse <Tracking>
		 * 
		 */
		GetAdTrackingNodeName: function(id, xml, nodeName){
        	   
		    var colonIndex = nodeName.indexOf(":");
		    var tag = nodeName.substr(colonIndex + 1);
		    var nodes = xml.getElementsByTagNameNS("*", tag);
		    
		    for (var i = 0; i < nodes.length; i++)
		    {
		    	
				var propertyName = nodes[i].getAttribute('event'); 
				var propertyValue = nodes[i].firstChild.nodeValue;
				adTracking = {};
				adTracking["adBreakID"] = id;
                adTracking[propertyName] = propertyValue;

                _adBreakTracking.push(adTracking);
            }
		},
		
		/**
		 * Gets the companion banner ad for the current ad break inside the <StaticResource> & <CompanionClickThrough> node
		 * 
		 * @id : the id of the current vmap:AdBreak
		 * 
		 * @currentAdTimeOffset : is the ad slot type preroll/midroll/postroll
		 * 
		 * @xml : top level xml node and all its children
		 * 
		 * 
		 */
		GetCompanionBannerAd: function(id, currentAdTimeOffset, xml){
        	
		    var adBreakIDNode = xml.getElementsByTagNameNS(vmap_namespace, 'AdSource')[id];
			var adBreakID = adBreakIDNode.getAttribute('id');
			
			var staticResourceNode = xml.getElementsByTagNameNS(vmap_namespace, 'StaticResource')[id];
			var staticResource = staticResourceNode.textContent;
			
			var companionClickThroughNode = xml.getElementsByTagNameNS(vmap_namespace, 'CompanionClickThrough')[id];
			var companionClickThrough = companionClickThroughNode.textContent;
			
			adBreakBanners = {};
			adBreakBanners["adBreakID"] = adBreakID;
			adBreakBanners["adPosition"] = currentAdTimeOffset;
			adBreakBanners["staticResource"] = staticResource;
			adBreakBanners["companionClickThrough"] = companionClickThrough;
			
			switch(currentAdTimeOffset){
				case "start":
					adBreakBanners["type"] = "preroll";
				break;
				case "end":
					adBreakBanners["type"] = "postroll";
				break;
				default:
					adBreakBanners["type"] = "midroll";
				break;
			}
			
			_adBreakCompanionBanners.push(adBreakBanners);
			
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
     