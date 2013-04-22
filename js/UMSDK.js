(function($){

    //
    // UMSDK namespace
    //
    var UMSDK = (function()
    {
        // Private function to traverse an xml node and generate an object or array
        //
        // @nodeObject : the node object to transerse from
        //
        // @return : an array of objects or an object of the specified node
        //
        var TraverseXML = function(nodeObject)
        {
            //Check if this is an array object
            if(nodeObject.nodeName.indexOf("ArrayOf") != -1)
            {
                var objectsArray = new Array();

                //Loop through the children and generate an object from it
                $(nodeObject).children().each(function (){
                    var object = TraverseXML(this);
                    objectsArray.push(object);
                });

                return objectsArray;
            }
            else
            {
                var object = new Object();
                //Loop through each of the children for this node
                $(nodeObject).children().each(function ()
                {
                    //Remove the namespacing
                    var nodeName = this.nodeName.replace("vmap:","");

                    //If this node has no children then just set its value
                    if($(this).children().length == 0)
                    {
                        object[nodeName] = $(this).text();
                    }
                    //This node has children so this variable is an object and needs to be traversed
                    else
                    {
                        object[nodeName] = TraverseXML(this);
                    }
                });

                return object;
            }
        };
        
        return {
    
            // Function to convert api xml response to an object
            //
            // @xml : the xml to parse
            //
            // @return : an array of objects or an object of the specified node
            //
            GetElementByNodeName: function(xml, nodeName)
			{   
			    var colonIndex = nodeName.indexOf(":");
			    var tag = nodeName.substr(colonIndex + 1);
			    var nodes = xml.getElementsByTagNameNS("*", tag);
			    for (var i = 0; i < nodes.length; i++)
			    {
			        
	        	  if (adBreakNodes.length <= 0) {
		                adBreaks = {
		                    breakType: nodes[i].getAttribute('breakType'),
		                    breakId: nodes[i].getAttribute('breakId'),
		                    timeOffset: nodes[i].getAttribute('timeOffset')
		                }
		
		                adBreakNodes.push(adBreaks);
		            }
                    else {
                        adBreaks = {
		                    breakType: nodes[i].getAttribute('breakType'),
		                    breakId: nodes[i].getAttribute('breakId'),
		                    timeOffset: nodes[i].getAttribute('timeOffset')
		                }

                        adBreakNodes.push(adBreaks);
                    }
			    }
			}
        };
    }());
    window.UMSDK = UMSDK;


})(jQuery)
