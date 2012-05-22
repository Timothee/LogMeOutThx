// Script that will be embedded in all pages
// - forwards keyboard events to background.js
// - display message when requested by other scripts
// (c) 2012 Timothée Boucher timotheeboucher.com

// Listens to keypress and forwards events to background.js
window.addEventListener('keydown', sendKeyEvent, false);

var keyAttributesToMatch = ["ctrlKey", "altKey", "shiftKey", "metaKey", "keyIdentifier"];

function sendKeyEvent(event) {
  var cleanEvent = {};
  for (i = 0; i < keyAttributesToMatch.length; i++) {
    attribute = keyAttributesToMatch[i];
    cleanEvent[attribute] = event[attribute].toString();
  }
  chrome.extension.sendRequest({command: "keyEvent", keyEvent: cleanEvent});
} // sendKeyEvent

function displayMessage(element_id, element_content, root_for_element, timeout) {
  root_for_element = typeof root_for_element !== 'undefined' ? root_for_element : document.body;
  timeout = typeof timeout !== 'undefined' ? timeout : 3000;
  
  var elt = document.getElementById(element_id);
  if (elt) {
    elt.style.display = "block";
  } else {
    elt = document.createElement('div');
    elt.id = element_id;
    root_for_element.appendChild(elt);
  }
  elt.innerHTML = element_content;
  elt.setAttribute('style', "font-family: Helvetica, Arial, sans-serif; position: fixed; top: 20px; left: 20px; max-width: 350px; background-color: #f0f0f0; color: #333333; border: 1px solid #aaa; padding: 15px;z-index:99999;border-image: initial;font-size: 1.3em;border-radius: 5px;box-shadow: 0px 6px 10px rgba(51,51,51,0.5); text-shadow: 0px 1.5px white;");
  setTimeout(function () { elt.style.display = "none"; }, timeout);
} // displayMessage
