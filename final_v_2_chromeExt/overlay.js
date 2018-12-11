// let peerInfo = {
//   myPeerId: null,
//   peerIdToCall: null
// };

document.body.innerHTML += "<div id='infoBar'><div id='myIdDiv'><input id='myId' placeholder='who are you?'></input></div><div id='idToCallDiv'><input id='idToCall' placeholder='who are you calling?'></input></div></div>";

//divs
myIdDiv = document.getElementById("myIdDiv");
idToCallDiv = document.getElementById("idToCallDiv");

//inputs
myId = document.getElementById("myId");
idToCall = document.getElementById("idToCall");

//don't show this div until later
// if (peerInfo.myPeerId && peerInfo.peerIdToCall){
//   myIdDiv.style.visibility = "hidden";
//   idToCallDiv.style.visibility = "hidden";
// } else if (peerInfo.myPeerId) {
//   idToCallDiv.style.visibility = "visible";
//   myIdDiv.style.visibility = "hidden";
// } else {
//   myIdDiv.style.visibility = "visible";
//   idToCallDiv.style.visibility = "hidden";
// }



//get id when the user hits enter
myId.addEventListener('keyup', function(e) {
  e.preventDefault();
  if (e.keyCode === 13 && this.value != "") {
    console.log("enter key pressed!");
    peerInfo.myPeerId = myId.value;
    sendPeerInfo();
    // myIdDiv.style.visibility = "hidden";
    // idToCallDiv.style.visibility = "visible";
  }
});

idToCall.addEventListener('keyup', function(e) {
  e.preventDefault();
  if (e.keyCode === 13 && this.value != "") {
    console.log("enter key pressed!");
    peerInfo.peerIdToCall = idToCall.value;
    sendPeerInfo();
    // idToCallDiv.style.visibility = "hidden";
  }
});

//get info from the popup.html window
function sendPeerInfo() {
  //send to background.js
  chrome.runtime.sendMessage(peerInfo);
  console.log("send to background", peerInfo);
}
