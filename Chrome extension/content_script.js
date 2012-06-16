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


// Creates the div used for message display and hides
function createMessageDiv(element_id, root_for_element) {
  root_for_element = typeof root_for_element !== 'undefined' ? root_for_element : document.body;
  var elt = document.getElementById(element_id + "_container");
  if (!elt) {
    elt = document.createElement('div');
    elt.id = element_id + "_container";
    elt.innerHTML = "<div id='" + element_id + "_message'></div>";
    elt.className = "LMOT_hidden";
    root_for_element.appendChild(elt);
  }
} // createMessageDiv

// Updates the content of the message div
function updateMessage(element_id, element_content, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout : 3000;
  
  var container = document.getElementById(element_id + "_container");
  if (container) {
    var message = document.getElementById(element_id + "_message");
    message.innerHTML = element_content;
    container.className = "LMOT_displayed";
    setTimeout(function () { container.className = "LMOT_hidden"; }, timeout);
  }
} // updateMessage
