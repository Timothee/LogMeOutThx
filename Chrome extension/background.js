// This is used for message passing between the background page and content scripts.
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {		
    // This allows passing the saved keyboard shortcut to the options page and the content script
    if (request.command == "restoreOptions") {
      myCtrl 		= localStorage["ctrl"];
    	myAlt 		= localStorage["alt"];
    	myShift   = localStorage["shift"];
    	myMeta    = localStorage["meta"];
			myKeyIdentifier = localStorage['keyIdentifier'];

    	// defines default shortcut Alt+\
    	myCtrl 		= (typeof myCtrl == "undefined"   ? "false":myCtrl);
    	myAlt			= (typeof myAlt == "undefined"    ? "true":myAlt);
    	myShift 	= (typeof myShift == "undefined"  ? "false":myShift);
    	myMeta   	= (typeof myMeta == "undefined"   ? "false":myMeta);
			myKeyIdentifier = (typeof myKeyIdentifier == "undefined"	? "U+005C":myKeyIdentifier);
    	
      sendResponse({ctrl: myCtrl,
                    alt: myAlt,
                    shift: myShift,
                    meta: myMeta,
										keyIdentifier: myKeyIdentifier});
		} else if (request.command == "injectScript") {
		  chrome.tabs.executeScript(null, {file: 'logmeout.js', allFrames: true});
    } else {
      sendResponse({});
    } // if
  });