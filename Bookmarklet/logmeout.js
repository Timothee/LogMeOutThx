/*
 * Script to (try to) log out of the current website
 * (c) 2010 Timothee Boucher - All rights reserved
 * www.timotheeboucher.com
 */

(function(){
  var bgColor; // to store background color of hovered element in showMe()
  var textColor; // to store the text color of hovered element in showMe()
  var mouseTarget; // to store the hovered element
  
  var stringsToMatch = ["sign\\s*off", "sign\\s*out", "log\\s*out", "log\\s*off", "disconnect", // EN
                  "déconnexion", "se\\s+déconnecter" // FR
                  ];
  var regexes = [];
  var matchingElts = [];


  // main function
  function start() {
    // this site needs a particular element to be activated
    if (localStorage && localStorage["logmeoutthx"]) {
      
      var candidates = findElementsFromInfo(localStorage["logmeoutthx"]);
      for (var i = 0; i < candidates.length; i++) {
        activateElement(candidates[i]);
      }      
    } else {
      // general case, based on common strings
      // we look for matching elements
      
      // generate regex objects;
      for (var i = 0; i < stringsToMatch.length; i++) {
        regexes.push(new RegExp("\\b"+stringsToMatch[i]+"\\b", "i"));
      }
      
      
      // Let's get it started!
      traverseElement(document.body, isElementMatchingStrings);
      
      if (matchingElts.length === 0) {
        nothingFound();
      } else if (matchingElts.length === 1) {
        activateElement(matchingElts[0]);
      } else {
        letMeDecide();
      }
    }
  }

  function isElementMatchingStrings (element) {
    var attributesToCheck = ["alt", "data", "id", "value", "title"];
    for (var i = 0; i < regexes.length; i++) {
      for (var j = 0; j < attributesToCheck.length; j++) {
        if (regexes[i].test(element[attributesToCheck[j]])) {
          return true;
        }
      }
    }
    return false;
  }
  
  function traverseElement (element, func) {
    processElement(element, func);
    var child = element.firstChild;
    while (child) {
      traverseElement(child, func);
      child = child.nextSibling;
    }
    return;
  }

  function processElement (element, func) {
    if (/^iframe$/i.test(element.tagName)) {
      if (element.contentDocument) {
        traverseElement(element.contentDocument.body, func);
      }
    } else if (func(element)) {
      matchingElts.push(element);
    }
    return;
  }
  
  function findAction (element) {
    if (/^body$/i.test(element.tagName)) {
      return;
    } else {
      if (!activateElement(element)) {
        findAction(element.parentNode);
      }
    }
  }
  
  function activateElement (element) {
    var myEvent;
    if (document.createEventObject) {
      myEvent = document.createEventObject();
      return element.fireEvent('onclick', myEvent);
    } else {
      myEvent = document.createEvent("HTMLEvents");
      myEvent.initEvent('click', true, true);
      return !element.dispatchEvent(myEvent);
    }
  }
  
  function nothingFound() {
    var elt = document.createElement('div');
    elt.id = "logMeOutMessage";
    // elt.innerHTML = '<strong>LogMeOut</strong><br/>Embarrassing but I did not find anything...';
    elt.innerHTML = "<strong>LogMeOut</strong><br/>Embarrassing but I did not find anything... Maybe you could show me and I\'ll remember for next time.<br/>Just put your mouse cursor over the element you would click to log out and press Alt+Shift+S on your keyboard.<div id='logMeOutThx.showMe' style='text-decoration: underline;cursor:pointer'>Ok, I\'ll show you!</div> <div id='logMeOutThx.nevermind' style='text-decoration: underline;cursor:pointer'>Nevermind...</div>";
    elt.setAttribute('style', "position: fixed; top: 10px; left: 10px; max-width: 350px; background-color: #eeeeee; color: #3b2221; border: 3px solid #666666; padding: 10px;z-index:99999;");
    document.body.appendChild(elt);
    document.getElementById('logMeOutThx.showMe').onclick = showMe;
    document.getElementById('logMeOutThx.nevermind').onclick = nevermind;
    // setTimeout(function(){elt.style.display = "none";}, 3000);
  }
  
  function letMeDecide() {
    for (var i = 0; i < matchingElts.length; i++) {
      findAction(matchingElts[i]);
    }
  }

  
  function showMe() {
    document.getElementById('logMeOutMessage').innerHTML = '<strong>LogMeOut</strong><br/>';
    document.body.addEventListener('mouseover', changeBgColor, true);
    document.body.addEventListener('mouseout', changeTextColor, true);
    document.body.addEventListener('keypress', saveTarget, true);
  }
  
  function changeBgColor (event) {
    mouseTarget = event.target;
    bgColor = event.target.style.backgroundColor;
    event.target.style.backgroundColor = '#00f';
    textColor = event.target.style.color;
    event.target.style.color = '#FFF';
  }

  function changeTextColor (event) {
    event.target.style.backgroundColor = bgColor;
    event.target.style.color = textColor;
  }

  function nevermind() {
    var box  = document.getElementById('logMeOutMessage');
    box.parentNode.removeChild(box);
  }
  
  function saveTarget(event) {
    if (event.altKey === true && event.shiftKey === true && event.keyCode == 205) {
      if (mouseTarget.id != undefined && mouseTarget.id != "") {
        localStorage.setItem("logmeoutthx", '{"id": "'+mouseTarget.id+'"}');
      } else if (/^img$/i.test(mouseTarget.tagName) && mouseTarget.src != undefined && mouseTarget.src != "") {
        localStorage.setItem("logmeoutthx", "{'tagName':'"+mouseTarget.tagName+"', 'src': '"+mouseTarget.src+"'}");
      } else if (/^a$/i.test(mouseTarget.tagName) && mouseTarget.href != undefined && mouseTarget.href != "" && mouseTarget.href != "#") {
        localStorage.setItem("logmeoutthx", "{'tagName': 'a', 'href':'"+mouseTarget.href+"'}");
      } else if (false) { // find id for children
      
      } else {
        // this element will be too hard to detect, do you want to try again?
      }
      mouseTarget.style.backgroundColor = bgColor;
      mouseTarget.style.color = textColor;
      document.body.removeEventListener('mouseover', changeBgColor, true);
      document.body.removeEventListener('mouseout', changeTextColor, true);
      document.body.removeEventListener('keypress', saveTarget, true);
      
      var message = document.getElementById('logMeOutMessage');
      message.parentNode.removeChild(message);
    }
  }
  
  function findElementsFromInfo (localStorageString) {
    var elt = eval("("+localStorageString+")");
    if (elt.id != undefined) {
      return [document.getElementById(elt.id)];
    } else if (/^img$/i.test(elt.tagName) && elt.src != undefined) {
      var imgs = document.getElementsByTagName(elt.tagName);
      var ret = [];
      for (var i = 0; i < imgs.length; i++) {
        if (imgs[i][elt.attr] == elt.attr_value) {
          ret.push(imgs[i]);
        }
      }
    } else if (/^a$/i.test(elt.tagName) && elt.href != undefined) {
      localStorage.setItem("logmeoutthx", "{'tagName': 'a', 'href':'"+mouseTarget.href+"'}");
    } else if (false) { // find id for children
    
    } else {
    
    }
  }

  start();
})();