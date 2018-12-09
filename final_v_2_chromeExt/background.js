//GLOBAL VARIABLES

var myPeerID = null;
var peer = null;
var connection = null;

console.log("beverly live web - background.js");

var init = function() {
  peer = new Peer(myPeerID, {
    host: 'bc2542.itp.io',
    secure: true,
    port: 9000,
    path: '/'
  });

  peer.on('error', function(err) {
    console.log(err);
  });

  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    myPeerID = id;
  });

  peer.on('connection', function(conn) {
    connection = conn;

    connection.on('open', function() {
      console.log('do stuff');
    });
  });
};

var makeCall = function() {
  connection = peer.connect(document.getElementById('peerIdToCall').value);
  connection.on('open', function(data) {
    console.log('connection established');
  });
};



chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "myscript.js"});
});

//listen for messages from popup.js
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
  //got user data
  myPeerID = data;
  console.log("got id from user:", myPeerID);
  //initilize peer server
  init();
});
