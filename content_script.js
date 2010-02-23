var ctrl, alt, shift, meta, keyCode;

chrome.extension.sendRequest({command: "restoreOptions"}, handleResponse);

function handleResponse(response) {
  console.log(response);
  ctrl = response.ctrl=="true";
  alt = response.alt=="true";
  shift = response.shift=="true";
  meta = response.meta=="true";
  keyCode = response.keyCode;
  console.log('CALLBACK Ctrl: '+ctrl+" Alt: "+alt+" Shift: "+shift+" Meta: "+meta+" keyCode: "+keyCode);
};

setTimeout(function(){console.log('Ctrl: '+ctrl+" Alt: "+alt+" Shift: "+shift+" Meta: "+meta+" keyCode: "+keyCode);}, 1000);

document.body.addEventListener('keypress', launchLogMeOut, true);

function launchLogMeOut (event) {
  // console.log('Ctrl: '+ctrl+" Alt: "+alt+" Shift: "+shift+" Meta: "+meta+" keyCode: "+keyCode);
  console.log(event.keyCode + " " + event.charCode + " " + event.which + " " + event.keyIdentifier);
  if (event.ctrlKey == ctrl && event.altKey == alt && event.shiftKey == shift && event.metaKey == meta && event.keyCode == keyCode) {
    alert('let\'s dance');
  }
}
