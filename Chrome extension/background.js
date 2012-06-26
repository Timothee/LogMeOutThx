// This script is used for message passing between the background page and content scripts.

// Check if we're just after installation
// in which case, we're setting the default shortcut in localStorage to Alt+\
if (!localStorage.getItem("installed_time")) {
  localStorage['ctrlKey']        = "false";
  localStorage['altKey']         = "true";
  localStorage['shiftKey']       = "false";
  localStorage['metaKey']        = "false";
  localStorage['keyIdentifier']  = "U+005C";
  localStorage['showPageAction'] = "checked";
  localStorage['installed_time'] = new Date().getTime();
}


function togglePageAction(tabId) {
  if (tabId == undefined) {
    chrome.tabs.query({}, togglePageActionForTabs);
  } else {
    chrome.tabs.get(tabId, function(tab) { togglePageActionForTabs([tab]) });
  } // if
} // togglePageAction

function togglePageActionForTabs(tabs) {
  for (var i = 0; i < tabs.length; i++) {
    if (!/chrome-extension:\/\//.test(tabs[i].url)) {
      if (localStorage['showPageAction'] == "unchecked") {
        chrome.pageAction.hide(tabs[i].id);
      } else {
        chrome.pageAction.show(tabs[i].id);
      } // if
    } // if
  } // for
} // togglePageActionForTabs

chrome.tabs.onActivated.addListener(function(activeInfo) { togglePageAction(activeInfo['tabId']); });
chrome.tabs.onCreated.addListener(function(tab) { togglePageAction(tab.id); });
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { togglePageAction(tabId);});

togglePageAction();

// Managing the page action
// at first assuming there is no way to set if you want it or not
chrome.pageAction.onClicked.addListener(function(tab) {
  executeLogOutScriptInTab(tab);
});


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
                    keyIdentifier: myKeyIdentifier,
                    showPageAction: localStorage['showPageAction']});
    
    // Handles keyEvent sent by the content script
    } else if (request.command == "keyEvent") {
      console.log('[LogMeOutThx] keyEvent received');
      console.log(request.keyEvent);
      if (keyEventMatchLocalStorage(request.keyEvent)) {
        executeLogOutScriptInTab(sender.tab);
      }

    // Display message when one element is activated
    } else if (request.command == "elementActivated") {
      console.log("[LogMeOutThx] element Activated: ", sender);
      if (activatedPages.indexOf(sender.tab.id) == -1) {
        activatedPages.push(sender.tab.id);
        setTimeout(function() { activatedPages.remove(sender.tab.id); }, 5000);
        chrome.tabs.executeScript(sender.tab.id, {code: "updateMessage('logMeOutThx', '<h1>LogMeOutThx</h1><p>I clicked on something. Hopefully that will work&hellip;</p>', 10000);"});
      }

    // Display message when no matching element is found
    } else if (request.command == "nothingFound") {
      console.log("[LogMeOutThx] nothing found: ", sender);
      if (activatedPages.indexOf(sender.tab.id) == -1) {
        chrome.tabs.executeScript(sender.tab.id, {code: "updateMessage('logMeOutThx', '<h1>LogMeOutThx</h1><p>It&#x27;s embarassing but I couldn&#x27;t find anything. :-/', 3000);"});
      }

    } else if (request.command == "togglePageAction") {
      togglePageAction();
    } else {
      sendResponse({});
    } // if
  });


function executeLogOutScriptInTab(tab) {
  // The <div> for messages is created only when the shortcut matches
  chrome.tabs.insertCSS(tab.id, {file: 'logmeoutthx.css'});
  chrome.tabs.executeScript(tab.id, {code: "createMessageDiv('logMeOutThx', document.body);"},
    function() {
      // the <div> is only updated once created, which, you know, just make sense
      chrome.tabs.executeScript(tab.id, {code: "updateMessage('logMeOutThx', '<h1>LogMeOutThx</h1><p>LogMeOutThx was started.</p>', 10000);"},
        function() {
          chrome.tabs.executeScript(tab.id, {file: 'logmeout.js', allFrames: true});
          console.log('[LogMeOutThx] Added logmeout.js script to page');
        });
    });
} // executeLogOutScriptInTab


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
