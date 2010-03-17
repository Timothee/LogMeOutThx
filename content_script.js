// Script that will be embedded in all pages
// - retrieves keyboard shortcut from options
// - inserts LogMeOut script whenever KB shortcut is called
// The logout part is handled by the remote script on logmeoutthx.com
// (c) 2010 Timothée Boucher timotheeboucher.com

var ctrl, alt, shift, keyIdentifier;

// Retrieves KB shortcut setting
chrome.extension.sendRequest({command: "restoreOptions"}, restoreOptions);
function restoreOptions(response) {
  ctrl    = response.ctrl;
  alt     = response.alt;
  shift   = response.shift;
  keyIdentifier = response.keyIdentifier;
};

// Listens to keypress and adds script if it matches setting
window.addEventListener('keydown', launchLogMeOut, false);

function launchLogMeOut (event) {
  if (event.ctrlKey+"" == ctrl &&
      event.altKey+"" == alt &&
      event.shiftKey+"" == shift &&
      event.keyIdentifier == keyIdentifier) {
    var logMeOut;
    if (logMeOut!=undefined) {
      logMeOut.start();
    } else {
      var script=document.createElement('script');
      script.src='http://logmeoutthx.com/logmeout.js';
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }
}
