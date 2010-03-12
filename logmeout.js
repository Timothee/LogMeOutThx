/*
 * Script to (try to) log out of the current website
 * (c) 2010 Timothee Boucher - All rights reserved
 * www.timotheeboucher.com
 */

// Bookmarklet:
// javascript:var%20logMeOut;if(logMeOut!=undefined){logMeOut.start();}else{var%20script=document.createElement('script');script.src='http://logmeoutthx.com/logmeout.js';document.getElementsByTagName('head')[0].appendChild(script);}
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
      // findElement(localStorage["logmeoutthx"]); // function to define obviously
      alert('localStorage! Yay!');
      
      
      
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
  
  // function isTextAMatch (text) {
  //   var regexp;
  //   for (var i = 0; i < stringsToMatch.length; i++) {
  //     regexp = new RegExp("\\b"+stringsToMatch[i]+"\\b", "i");
  //     if (regexp.test(text)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
  
//
// Given an element, go through all its children elements recursively to find
// one element whose text data matches some strings.
// Once one element is found the "activateElement" function is called on it
// to try to simulate a click on it.
//
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
    if (/iframe/i.test(element.tagName)) {
      if (element.contentDocument) {
        traverseElement(element.contentDocument.body, func);
      }
    } else if (func(element)) {
      matchingElts.push(element);
    }
    return;
  }
  
  function findAction (element) {
    if (/body/i.test(element.tagName)) {
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
    elt.innerHTML = '<strong>LogMeOut</strong><br/>Embarrassing but I did not find anything...';
    // elt.innerHTML = '<strong>LogMeOut</strong><br/>That\'s embarrassing but I didn\'t find anything... Maybe you could show me and I\'ll remember for next time.<br/>Just put your mouse cursor over the element you would click to log out and press Alt+Shift+S on your keyboard.<div onclick="logMeOut.showMe()" style="text-decoration: underline;cursor:pointer">Ok, I\'ll show you!</div> <div onclick="logMeOut.nevermind();" style="text-decoration: underline;cursor:pointer">Nevermind...</div>';
    elt.setAttribute('style', "position: fixed; top: 10px; left: 10px; max-width: 350px; background-color: #eeeeee; color: #3b2221; border: 3px solid #666666; padding: 10px;z-index:99999;");
    document.body.appendChild(elt);
    setTimeout(function(){elt.style.display = "none";}, 3000);
  }
  
  function letMeDecide() {
    for (var i = 0; i < matchingElts.length; i++) {
      findAction(matchingElts[i]);
    }
  }

  
  function showMe() {
    document.getElementById('logMeOutMessage').innerHTML = '<strong>LogMeOut</strong><br/>';
    document.body.addEventListener('mouseover',
      function(event) {
        mouseTarget = event.target;
        bgColor = event.target.style.backgroundColor;
        event.target.style.backgroundColor = "#00f";
        textColor = event.target.style.color;
        event.target.style.color = "#FFF";
      }, true);
    document.body.addEventListener('mouseout',
        function(event) {
          event.target.style.backgroundColor = bgColor;
          event.target.style.color = textColor;
        }, true);
    document.body.addEventListener('keypress', saveTarget, true);
  }
  
  function nevermind() {
    var box  = document.getElementById('logMeOutMessage');
    box.parentNode.removeChild(box);
  }
  
  function saveTarget(event) {
    // var that = this;
    if (event.altKey === true && event.shiftKey === true && event.keyCode == 205) {
      console.log(logMeOut.mouseTarget);
      // logMeOut.findAction(logMeOut.mouseTarget);
      // do some JSONP magic to send information to server.
      // the server logs that and sends back something like
      // findActionFromDescription({id: #id, tagName: #tagName, etc...}) with a Timeout
      // and shows a message like it was saved...
    }
    console.log(event);
  }
  
  function manageFailure() {
    
  }


  start();
  // localStorage.setItem("logmeoutthx", "Hello!"+document.location.host);
})();