/*
 * Script to (try to) log out of the current website
 * (c) 2012 Timothee Boucher - All rights reserved
 * www.timotheeboucher.com
 */

(function(){
  var stringsToMatch = ["sign\\s*off", "sign\\s*out", "log\\s*out", "log\\s*off", "disconnect", // EN
    "déconnexion", "se\\s+déconnecter" // FR
    ];
  var attributesToCheck = ["alt", "data", "id", "value", "title", "innerHTML"];
  var tagsToIgnore = ["iframe", "script"];

  // generate regex objects
  var regexes = [];
  for (var i = 0; i < stringsToMatch.length; i++) {
    regexes.push(new RegExp("\\b"+stringsToMatch[i]+"\\b", "i"));
  } // for
    

  // Recursively traverse element and process current element
  // with callback function
  function traverseElement(element, matchingFunction, actingFunction) {
    var numberOfActivatedElements = 0;
    if (tagsToIgnore.indexOf(element.tagName.toLowerCase()) == -1) {
      if (matchingFunction(element)) {
        actingFunction(element);
        numberOfActivatedElements++;
      } // if
      for (var i = 0; i < element.children.length; i++) {
        numberOfActivatedElements += traverseElement(element.children[i], matchingFunction, actingFunction);
      } // for
    } // if
    return numberOfActivatedElements;
  } // traverseElement()
  
  // Callback function that tries to match the element's attributes
  // against all the regexes set up in start()
  function isElementAMatch(element) {
    for (var i = 0; i < regexes.length; i++) {
      for (var j = 0; j < attributesToCheck.length; j++) {
        if (regexes[i].test(element[attributesToCheck[j]])) {
          return true;
        } // if
      } // for
    } // for
    return false;
  } // isElementAMatch()
  
  // Simulate a click on designated element
  function activateElement(element) {
    console.log("[LogMeOutThx] firing click on element: " + element);

    chrome.extension.sendRequest({command: "elementActivated"});
  	
    var myEvent;
    if (document.createEventObject) {
      myEvent = document.createEventObject();
      return element.fireEvent('onclick', myEvent);
    } else {
      myEvent = document.createEvent("HTMLEvents");
      myEvent.initEvent('click', true, true);
      return !element.dispatchEvent(myEvent);
    } // if
  } // activateElement()
  
  // Displays a message if log out element can not be found
  function nothingFound() {
    chrome.extension.sendRequest({command: "nothingFound"});
  } // nothingFound()

  // Let's get it started!
  if (!traverseElement(document.body, isElementAMatch, activateElement)) {
    nothingFound();
  } // if

})();