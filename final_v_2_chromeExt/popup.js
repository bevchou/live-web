let myPeerID;
let timeStr;

//execute when the user clicks submit
document.getElementById("submit").addEventListener("click", function() {
  console.log("submit button clicked!");
  getInfo();

});

//execute when the user hits enter
document.getElementById("myPeerID").onkeypress = function(e) {
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == "13") {
    console.log("enter key pressed!");
    getInfo();
    return false;
  }
}

//get info from the popup.html window
function getInfo() {
  //get the user's peer id
  myPeerID = document.getElementById("myPeerID").value;

  //send to background.js
  chrome.runtime.sendMessage(myPeerID);
  console.log("send to background", myPeerID);
  //clear the input field
  document.getElementById("myPeerID").remove();
  document.getElementById("submit").remove();
}
