// This is used for message passing between the background page and content scripts.
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {		
    // This allows passing the saved keyboard shortcut to the options page and the content script
    if (request.command == "restoreOptions") {
      myCtrlKey       = localStorage["ctrlKey"];
      myAltKey        = localStorage["altKey"];
      myShiftKey      = localStorage["shiftKey"];
      myMetaKey       = localStorage["metaKey"];
      myKeyIdentifier = localStorage['keyIdentifier'];

      // defines default shortcut Alt+\
      myCtrlKey       = (typeof myCtrlKey == "undefined"   ? "false":myCtrlKey);
      myAltKey        = (typeof myAltKey == "undefined"    ? "true":myAltKey);
      myShiftKey      = (typeof myShiftKey == "undefined"  ? "false":myShiftKey);
      myMetaKey       = (typeof myMetaKey == "undefined"   ? "false":myMetaKey);
      myKeyIdentifier = (typeof myKeyIdentifier == "undefined"	? "U+005C":myKeyIdentifier);

      sendResponse({ctrlKey: myCtrlKey,
                    altKey: myAltKey,
                    shiftKey: myShiftKey,
                    metaKey: myMetaKey,
                    keyIdentifier: myKeyIdentifier});
    } else if (request.command == "injectScript") {
      chrome.tabs.executeScript(null, {file: 'logmeout.js', allFrames: true});
    } else {
      sendResponse({});
    } // if
  });
