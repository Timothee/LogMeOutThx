// Script that will be embedded in all pages
// - retrieves keyboard shortcut from options
// - inserts LogMeOut script whenever KB shortcut is called
// The logout part is handled by the logmeout.js script
// (c) 2012 Timothée Boucher timotheeboucher.com

var ctrlKey, altKey, shiftKey, metaKey, keyIdentifier;

// Retrieves KB shortcut setting
chrome.extension.sendRequest({command: "restoreOptions"}, restoreOptions);

function restoreOptions(response) {
  ctrlKey       = response.ctrlKey;
  altKey        = response.altKey;
  shiftKey      = response.shiftKey;
  metaKey       = response.metaKey;
  keyIdentifier = response.keyIdentifier;
};

// Listens to keypress and adds script if it matches setting
window.addEventListener('keydown', launchLogMeOut, false);

function launchLogMeOut(event) {
  if (event.ctrlKey+"" == ctrlKey &&
      event.altKey+"" == altKey &&
      event.shiftKey+"" == shiftKey &&
      event.metaKey+"" == metaKey &&
      event.keyIdentifier == keyIdentifier) {
    chrome.extension.sendRequest({command: "injectScript"}, function(data) { console.log("LogMeOut: script added.")});
  } // if
} // launchLogMeOut
