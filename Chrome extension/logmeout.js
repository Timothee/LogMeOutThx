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

    displayMessage('logMeOutMessage', '<strong>LogMeOutThx</strong><br/>I just clicked on something. Hopefully that will work :)');

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
    displayMessage('logMeOutMessage', '<strong>LogMeOutThx</strong><br/>It\'s embarrassing but I did not find anything this time&hellip;');
  } // nothingFound()

  // Common function to display a message in the message box
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
    setTimeout(function(){elt.style.display = "none";}, timeout);
  } // displayMessage

  // Let's get it started!
  displayMessage('logMeOutMessage', '<strong>LogMeOutThx</strong><br/>Ok, let\'s see&hellip;');
  if (!traverseElement(document.body, isElementAMatch, activateElement)) {
    nothingFound();
  } // if

})();