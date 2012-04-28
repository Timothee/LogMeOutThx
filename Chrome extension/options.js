var ctrl, alt, shift, meta, keyIdentifier;

// Retrieves KB shortcut setting
chrome.extension.sendRequest({command: "restoreOptions"}, restoreOptions);

function restoreOptions(response) {
  ctrl    = response.ctrl;
  alt     = response.alt;
  shift   = response.shift;
  meta    = response.meta;
  keyIdentifier = response.keyIdentifier;
	updateShortcutField();
} // restoreOptions

// Update textfield with saved or current shortcut
function updateShortcutField () {
	var shortcut = "";
	var mac = /Macintosh/i.test(navigator.userAgent);
	if (ctrl == "true")		shortcut += (mac?"\u2303":"Ctrl+");
	if (alt == "true")		shortcut += (mac?"\u2325":"Alt+");
	if (shift == "true")	shortcut += (mac?"\u21e7":"Shift+");
	if (meta == "true")	  shortcut += (mac?"\u2318":"Meta+");
	
	if (mac) shortcut += " ";
	shortcut += unicodeFromKeyIdentifier(keyIdentifier);
	// Shortcut needs at least one modifier key
	if (!(ctrl || alt || shift || meta) || shortcut == " ") {
	  shortcut = "?";
	} // if
	document.getElementById('shortcut').innerHTML = shortcut;
} // updateShortcutField

// Resets KB (without saving) and starts listening to keystrokes
function startEditing() {
  ctrl = alt = shift = meta = false;
  keyIdentifier = '';
  document.body.addEventListener('keydown', modifierKeys, true);
  document.body.addEventListener('keyup', modifierKeys, true);
  document.body.addEventListener('keypress', mainKey, true);
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
    } // if
    ctrl = event.ctrlKey + "";
    alt = event.altKey + "";
    shift = event.shiftKey + "";
    meta = event.metaKey + "";
    if (meta == "true" && /U\+[0-9A-E]{4}/.test(event.keyIdentifier)) {
      // When meta is pressed, the keypress event is typically not fired because no character is printed
      // This works around that by pretending it was fired.
      mainKey(event);
    } // if
  } // if
  updateShortcutField();
} // modifierKeys

// Grabs the shortcut and saves it
function mainKey (event) {
	if (event) {
		if (ctrl == "true" || alt == "true" || shift == "true" || meta == "true") {
			keyIdentifier = event.keyIdentifier;
			resetField();
			saveOptions();
			updateShortcutField();
		} else {
			keyIdentifier = '';
		} // if
	} // if
} // mainKey

// Stops listeners
function resetField () {
  document.body.removeEventListener('keydown', modifierKeys, true);
  document.body.removeEventListener('keyup', modifierKeys, true);
  document.body.removeEventListener('keypress', mainKey, true);
  document.getElementById('shortcut').className = "";
} // resetField

// Called when Esc is pressed
function cancelEditing (argument) {
	resetField();
	chrome.extension.sendRequest({command: "restoreOptions"}, restoreOptions);
} // cancelEditing

// Saves options to localStorage.
function saveOptions() {
	if (keyIdentifier == '') {
		return false;
	} else {
	  localStorage['ctrl']   	= ctrl;
	  localStorage['alt']     = alt;
	  localStorage['shift']   = shift;
	  localStorage['meta']    = meta;
		localStorage['keyIdentifier'] = keyIdentifier;
		return true;
	} // if
} // saveOptions

// Transforms keyIdentifier value into Unicode character
function unicodeFromKeyIdentifier (keyId) {
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
function cancelOnClick (event) {
	if (event.target.id != "shortcut" && event.target.id != "subtext") {
		cancelEditing();
	} // if
} // cancelOnClick



// Setting up event handlers
document.addEventListener('DOMContentLoaded', function() {
  updateShortcutField();
  document.body.addEventListener('click', cancelOnClick);
  document.getElementById('shortcut').addEventListener('click', startEditing);
  document.getElementById('subtext').addEventListener('click', startEditing);
})
