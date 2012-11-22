var ctrlKey, altKey, shiftKey, metaKey, keyIdentifier;

// Retrieves KB shortcut setting
chrome.extension.sendRequest({command: "restoreOptions"}, restoreOptions);

function restoreOptions(response) {
  ctrlKey       = response.ctrlKey;
  altKey        = response.altKey;
  shiftKey      = response.shiftKey;
  metaKey       = response.metaKey;
  keyIdentifier = response.keyIdentifier;
  updateShortcutField();
  document.getElementById('pageAction_checkbox').className = response.showPageAction;
} // restoreOptions

// Update textfield with saved or current shortcut
function updateShortcutField () {
	var shortcut = "";
	var mac = /Macintosh/i.test(navigator.userAgent);
	if (ctrlKey == "true")  shortcut += (mac?"\u2303":"Ctrl+");
	if (altKey == "true")   shortcut += (mac?"\u2325":"Alt+");
	if (shiftKey == "true") shortcut += (mac?"\u21e7":"Shift+");
	if (metaKey == "true")  shortcut += (mac?"\u2318":"Meta+");
	
	if (mac) shortcut += " ";
	shortcut += unicodeFromKeyIdentifier(keyIdentifier);
	// Shortcut needs at least one modifier key
	if (!(ctrlKey || altKey || shiftKey || metaKey) || shortcut == " ") {
	  shortcut = "?";
	} // if
	document.getElementById('shortcut').innerHTML = shortcut;
} // updateShortcutField

// Resets KB (without saving) and starts listening to keystrokes
function startEditing() {
  ctrlKey = altKey = shiftKey = metaKey = false;
  keyIdentifier = '';
  document.body.addEventListener('keydown', modifierKeys, true);
  document.body.addEventListener('keyup', modifierKeys, true);
  document.getElementById('shortcut').className = "editing";
  updateShortcutField();
} // startEditing

// Used for live updating before a "real" key is pressed
function modifierKeys (event) {
  if (event) {
		// Cancels if Esc is pressed
		if (event.keyCode == "27") {
			cancelEditing();
			return;
		} else if (event.keyIdentifier == "Control" ||
				event.keyIdentifier == "Shift" ||
				event.keyIdentifier == "Alt" ||
				event.keyIdentifier == "Meta") {
			ctrlKey = event.ctrlKey + "";
			altKey = event.altKey + "";
			shiftKey = event.shiftKey + "";
			metaKey = event.metaKey + "";
		} else {
			if (ctrlKey == "true" || altKey == "true" || shiftKey == "true" || metaKey == "true") {
				keyIdentifier = event.keyIdentifier;
				resetField();
				saveShortcut();
				updateShortcutField();
			} else {
				keyIdentifier = '';
			} // if
		}
  } // if
  updateShortcutField();
} // modifierKeys

// Stops listeners
function resetField () {
  document.body.removeEventListener('keydown', modifierKeys, true);
  document.body.removeEventListener('keyup', modifierKeys, true);
  document.getElementById('shortcut').className = "";
} // resetField

// Called when Esc is pressed
function cancelEditing (argument) {
	resetField();
	chrome.extension.sendRequest({command: "restoreOptions"}, restoreOptions);
} // cancelEditing

// Saves options to localStorage.
function saveShortcut() {
  if (keyIdentifier == '') {
    return false;
  } else {
    localStorage['ctrlKey']       = ctrlKey;
    localStorage['altKey']        = altKey;
    localStorage['shiftKey']      = shiftKey;
    localStorage['metaKey']       = metaKey;
    localStorage['keyIdentifier'] = keyIdentifier;
    return true;
  } // if
} // saveShortcut

// Transforms keyIdentifier value into Unicode character
function unicodeFromKeyIdentifier(keyId) {
  if (res = /[0-9A-E]{2}\b/.exec(keyId)) {
   return unescape("%"+res[0]);
   // TODO try to use \uXXXX instead of unescape, so that any language should work
  // if (res = /U\+([0-9A-E]{4})\b/.exec(keyId)) {
    // return String('\\u'+res[1]);
	} else {
		return keyId;
	} // if
} // unicodeFromKeyIdentifier

// Cancel editing if one clicks outside of the input field and its label
function cancelOnClick(event) {
	if (event.target.id != "shortcut" && event.target.id != "subtext") {
		cancelEditing();
	} // if
} // cancelOnClick

function toggleCheckbox() {
  var elt = document.getElementById('pageAction_checkbox');
  localStorage["showPageAction"] = elt.className = (elt.className == "checked" ? "unchecked" : "checked");
  chrome.extension.sendRequest({command: "togglePageAction"}, function(){});
} // toggleCheckbox

// Setting up event handlers
document.addEventListener('DOMContentLoaded', function() {
  updateShortcutField();
  document.body.addEventListener('click', cancelOnClick);
  document.getElementById('shortcut').addEventListener('click', startEditing);
  document.getElementById('subtext').addEventListener('click', startEditing);
  document.getElementById('pageAction_checkbox').className = (localStorage['showPageAction'] == 'checked' ? 'checked' : 'unchecked');
  document.getElementById('pageAction_checkbox').addEventListener('click', toggleCheckbox);
});
