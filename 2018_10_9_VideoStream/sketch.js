//connect client to websocket
var socket = io.connect();
socket.on('connect', function() {
  console.log("Connected");
});

// Receive from any event
socket.on('webcamImg', function(dataURL) {
  console.log("get video frame data");
  let newImg = document.createElement('img');
  newImg.src = dataURL;
  let chat = document.getElementById('chatBody');
  chat.insertBefore(newImg, chat.childNodes[0]);
});

// function
// var sendmessage = function(message) {
//   console.log("colorMessage: " + message);
//   socket.emit('colorMessage', message);
// };


//GLOBAL VARIABLES
let width = 300;
let height = 0;
let streaming = false;


// run code once the window loads
window.addEventListener('load', function() {

  //get elements
  let video = document.getElementById('myVideo');
  let canvas = document.getElementById('myCanvas');
  let sendPic = document.getElementById('sendPic');

  // what media we want
  let constraints = {
    audio: false,
    video: true
  }

  // get permission to get video/audio
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      // attach stream to video object
      video.srcObject = stream;
      // wait for stream to load enough to play
      video.onloadedmetadata = function(e) {
        //play video
        video.play();
      };
    })
    // if error, send to console
    .catch(function(err) {
      console.log(err);
    });

  // if video starts to play
  video.addEventListener('canplay', function(ev) {
    if (!streaming) {
      // set the width and height of video and canvas the same
      height = video.videoHeight / (video.videoWidth / width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  //when you click on send button
  sendPic.addEventListener('click', function() {
    //get canvas context
    let context = canvas.getContext('2d');
    //when the width and height are available
    //draw the image to the canvas
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    }
    //get the data URL & send to other clients
    let imgDataURL = canvas.toDataURL();
    socket.emit('webcamImg',imgDataURL);
  });

});
