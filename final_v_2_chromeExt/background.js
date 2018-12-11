//GLOBAL VARIABLES

// var peerInfo = null;
let peerInfo = {
  myPeerId: null,
  peerIdToCall: null
};
var peer = null;
var connection = null;

console.log("beverly live web - background.js");

var initPeerConnection = function() {
  peer = new Peer(peerInfo.myPeerId, {
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
    peerInfo.myPeerID = id;
  });

  peer.on('connection', function(conn) {
    connection = conn;

    connection.on('open', function() {
      console.log('do stuff');
    });
  });
};

var makeCall = function() {
  connection = peer.connect(peerInfo.peerIdToCall);
  connection.on('open', function(data) {
    console.log('connection established');
  });
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  //find the active tab
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    //inject css into active tab
    chrome.tabs.insertCSS(tabs[0].id, {
      file: "style.css"
    }, function() {
      console.log("added css");
    });
  });

  //run the content script in the tab
  chrome.tabs.executeScript(null, {
    file: "overlay.js"
  });

});





chrome.browserAction.onClicked.addListener(function(tab) {
  // chrome.tabs.executeScript(null, {file: "myscript.js"});
});

//listen for messages from popup.js
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
  //got user data
  peerInfo = data;
  console.log("got id from user:", peerInfo);
  //initilize peer server
  initPeerConnection();
  if (peerInfo.peerIdToCall) {
    makeCall();
  }
});
