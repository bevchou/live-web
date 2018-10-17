//GLOBAL VARIABLES
let width = 300;
let height = 0;
let streaming = false;

var socket = null;
var my_stream = null;
var peer_id = null;
var peer = null;


// run code once the window loads
window.addEventListener('load', function() {

  //get elements
  let video = document.getElementById('myVideo');
  let callButton = document.getElementById('callButton');

  // what media we want
  let constraints = {
    audio: false,
    video: true
  }

  // get permission to get video/audio
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      // attach stream to video object
      video.srcObject = stream;
      my_stream = stream;
      // wait for stream to load enough to play
      video.onloadedmetadata = function(e) {
        //play video
        video.play();
        //connect users
        connectPeer();
      };
    })
    // if error, send to console
    .catch(function(err) {
      console.log(err);
    });

  // if video is able to play
  video.addEventListener('canplay', function(ev) {
    if (!streaming) {
      // set the width and height of video and canvas the same
      height = video.videoHeight / (video.videoWidth / width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  function connectPeer() {
    peer = new Peer({
      host: 'liveweb-new.itp.io',
      port: 9000,
      path: '/'
    });

    // Get an ID from the PeerJS server
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      peer_id = id;

      socket = io.connect();

      socket.on('connect', function() {
        console.log("connect");
        socket.emit('peerid', peer_id);
      });

      socket.on('peerid', function(data) {
        makeCall(data);
      });
    });

    peer.on('error', function(err) {
      console.log(err);
    });

    peer.on('call', function(incoming_call) {
      console.log("Got a call!");
      console.log(incoming_call);
      incoming_call.answer(my_stream); // Answer the call with our stream from getUserMedia
      incoming_call.on('stream', function(remoteStream) { // we receive a getUserMedia stream from the remote caller
        // And attach it to a video object
        var ovideoElement = document.createElement('video');
        ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
        ovideoElement.autoplay = true;
        ovideoElement.controls = true;
        ovideoElement.playsInline = true;
        ovideoElement.play();
        document.body.appendChild(ovideoElement);

      });
    });

    callButton.addEventListener('click', function() {
      let idToCall = document.getElementById('idToCall').value;
      makeCall(idToCall);
    });

    function makeCall(idToCall) {
      //var idToCall = document.getElementById('tocall').value;
      console.log("peer: " + peer);
      var call = peer.call(idToCall, my_stream);
      console.log("made a call: " + call);

      call.on('stream', function(remoteStream) {
        console.log("Got remote stream");
        var ovideoElement = document.createElement('video');
        ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
        ovideoElement.autoplay = true;
        ovideoElement.controls = true;
        ovideoElement.playsInline = true;
        ovideoElement.play();
        document.body.appendChild(ovideoElement);
      });
    }


  }

});
