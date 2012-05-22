// This script is used for message passing between the background page and content scripts.
var keyAttributesToMatch = ["ctrlKey", "altKey", "shiftKey", "metaKey", "keyIdentifier"];
var activatedPages = [];

Array.prototype.remove = function(element) {
  return this.indexOf(element) != -1 ? this.splice(this.indexOf(element), 1) : this;
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    // passes the saved keyboard shortcut to the options page
    if (request.command == "restoreOptions") {
      myCtrlKey       = localStorage["ctrlKey"];
      myAltKey        = localStorage["altKey"];
      myShiftKey      = localStorage["shiftKey"];
      myMetaKey       = localStorage["metaKey"];
      myKeyIdentifier = localStorage['keyIdentifier'];

      // defines default shortcut as Alt+\
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
    
    // Handles keyEvent sent by the content script
    } else if (request.command == "keyEvent") {
      console.log('[LogMeOutThx] keyEvent received');
      console.log(request.keyEvent);
      if (keyEventMatchLocalStorage(request.keyEvent)) {
        chrome.tabs.executeScript(sender.tab.id, {code: "displayMessage('logMeOutMessage', '<h1>LogMeOutThx</h1><p>LogMeOutThx was started.</p>');"}, function() {
          chrome.tabs.executeScript(sender.tab.id, {file: 'logmeout.js', allFrames: true});
          console.log('[LogMeOutThx] Added logmeout.js script to page');
        });
      }

    // Display message when one element is activated
    } else if (request.command == "elementActivated") {
      console.log("[LogMeOutThx] element Activated: ", sender);
      if (activatedPages.indexOf(sender.tab.id) == -1) {
        activatedPages.push(sender.tab.id);
        setTimeout(function() { activatedPages.remove(sender.tab.id); }, 5000);
        chrome.tabs.executeScript(sender.tab.id, {code: "displayMessage('logMeOutMessage', '<h1>LogMeOutThx</h1><p>I clicked on something. Hopefully that will work&hellip;</p>');"});
      }

    // Display message when no matching element is found
    } else if (request.command == "nothingFound") {
      console.log("[LogMeOutThx] nothing found: ", sender);
      if (activatedPages.indexOf(sender.tab.id) == -1) {
        chrome.tabs.executeScript(sender.tab.id, {code: "displayMessage('logMeOutMessage', '<h1>LogMeOutThx</h1><p>It\'s embarassing but I couldn\'t find anything. :-/');"});
      }

    } else {
      sendResponse({});
    } // if
  });



// Matches keyEvent with was is saved in localStorage
// returns true if events match, false otherwise.
// Match is done on a short list of attributes (see keyAttributesToMatch)
function keyEventMatchLocalStorage(keyEvent) {
  var match = true;
  for (i = 0; i < keyAttributesToMatch.length; i++) {
    attribute = keyAttributesToMatch[i];
    if (keyEvent[attribute] != localStorage[attribute]) {
      console.log("Events don't match because " + attribute + " is different:" + keyEvent[attribute] + " vs. " + localStorage[attribute]);
      match = false;
    }
  }
  if (match) {
    console.log("Events match. Yay!");
  }
  return match;
} // keyEventMatchLocalStorage
