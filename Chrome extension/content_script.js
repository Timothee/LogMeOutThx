// Script that will be embedded in all pages
// - retrieves keyboard shortcut from options
// - inserts LogMeOut script whenever KB shortcut is called
// The logout part is handled by the logmeout.js script
// (c) 2012 Timothée Boucher timotheeboucher.com

var ctrl, alt, shift, meta, keyIdentifier;

// Retrieves KB shortcut setting
chrome.extension.sendRequest({command: "restoreOptions"}, restoreOptions);
function restoreOptions(response) {
  ctrl    = response.ctrl;
  alt     = response.alt;
  shift   = response.shift;
  meta    = response.meta;
  keyIdentifier = response.keyIdentifier;
};

// Listens to keypress and adds script if it matches setting
window.addEventListener('keydown', launchLogMeOut, false);

function launchLogMeOut(event) {
  if (event.ctrlKey+"" == ctrl &&
      event.altKey+"" == alt &&
      event.shiftKey+"" == shift &&
      event.metaKey+"" == meta &&
      event.keyIdentifier == keyIdentifier) {
      var script = document.createElement('script');
      script.src = chrome.extension.getURL('logmeout.js');
      document.body.appendChild(script);
    } // if
  } // if
} // launchLogMeOut
