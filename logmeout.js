/*
 * Script to (try to) log out of the current website
 * (c) 2010 Timothee Boucher - All rights reserved
 * www.timotheeboucher.com
 */

// Bookmarklet:
// javascript:var%20logMeOut;if(logMeOut!=undefined){logMeOut.manageFailure();}else{var%20script=document.createElement('script');script.src='http://www.logmeoutthx.com/logmeout.js';document.getElementsByTagName('head')[0].appendChild(script);}

var logMeOut = {
  stringsToMatch: ["signoff", "signout", "logout", "logoff", "disconnect", // EN
                  "déconnexion", "sedéconnecter", // FR
    ],

  inArray: function (needle, haystack) {
    for (var i=0; i < haystack.length; i++) {
      if (needle == haystack[i]) {
        return true;
      }
    }
    return false;
  },

  isTextAMatch: function (text) {
    if (this.inArray(text.toLowerCase().replace(" ", ""), this.stringsToMatch)) {
      return true;
    } else {
      return false;
    }
  },
  
  matchingElts: [],

  start: function () {
    this.traverseElement(document.body);
    if (this.matchingElts.length == 0) {
      this.nothingFound();
    } else if (this.matchingElts.length == 1) {
      this.findAction(this.matchingElts[0]);
    } else {
      this.letMeDecide();
    }
  },
  
//
// Given an element, go through all its children nodes recursively to find
// one node whose text data matches some strings.
// Once one element is found the "activateElement" function is called on it
// to try to simulate a click on it.
//
  traverseElement: function (element) {
    this.processNode(element);
    var child = element.firstChild;
    while (child) {
      this.traverseElement(child);
      child = child.nextSibling;
    }
  },

  processNode: function (node) {
    if (node.tagName && node.tagName.toLowerCase() == "iframe") {
      if (node.contentDocument) {
        this.traverseElement(node.contentDocument.body);
      }
    }
    if ((node.data && this.isTextAMatch(node.data)) ||
      (node.alt && this.isTextAMatch(node.alt)) ||
      (node.title && this.isTextAMatch(node.title)) ||
      (node.value && this.isTextAMatch(node.value))) {
      this.matchingElts.push(node);
    }
    return;
  },
  
  findAction: function (element) {
    if (element.onclick != null) {
      try {
        element.onclick();
      } catch (e) {
        console.log("Error with onclick:"+e);
      }
    } else if (element.href != null && element.href != "" && element.href != "#") {
      document.location = element.href;
    } else {
      this.findAction(element.parentNode);
    }
  },
  
  nothingFound: function() {
    var elt = document.createElement('div');
    elt.id = "logMeOutMessage";
    elt.innerHTML = '<strong>LogMeOut</strong><br/>That\'s embarrassing but I didn\'t find anything... Maybe you could show me and I\'ll remember for next time.<br/>Just put your mouse cursor over the element you would click to log out and press Alt+Shift+S on your keyboard.<div onclick="logMeOut.showMe()" style="text-decoration: underline;cursor:pointer">Ok, I\'ll show you!</div> <div onclick="logMeOut.nevermind();" style="text-decoration: underline;cursor:pointer">Nevermind...</div>';
    elt.setAttribute('style', "position: fixed; top: 10px; left: 10px; max-width: 350px; background-color: #eeeeee; color: #3b2221; border: 3px solid #666666; padding: 10px;z-index:99999;");
    document.body.appendChild(elt);
  },
  
  letMeDecide: function() {
    for (var i = 0; i < this.matchingElts.length; i++) {
      this.findAction(this.matchingElts[i]);
    }
  },
  
  showMe: function () {
    document.getElementById('logMeOutMessage').innerHTML = '<strong>LogMeOut</strong><br/>';
    var that = this;
    var bgColor;
    var textColor;
    document.body.addEventListener('mouseover',
      function(event) {
        that.mouseTarget = event.target;
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
    document.body.addEventListener('keypress', this.saveTarget, true);
  },
  
  nevermind: function () {
    var box  = document.getElementById('logMeOutMessage');
    box.parentNode.removeChild(box);
  },
  
  saveTarget: function (event) {
    // var that = this;
    if (event.altKey == true && event.shiftKey == true && event.keyCode == 205) {
      console.log(logMeOut.mouseTarget);
      logMeOut.findAction(logMeOut.mouseTarget);
      // do some JSONP magic to send information to server.
      // the server logs that and sends back something like
      // findActionFromDescription({id: #id, tagName: #tagName, etc...}) with a Timeout
      // and shows a message like it was saved...
    }
    console.log('hola');
    console.log(event);
  },
  
  manageFailure: function() {
    
  }
};

logMeOut.start();
