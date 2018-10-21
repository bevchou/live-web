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
let width = 600;
let height = 0;
let streaming = false;
let frontCam = true;
let isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(navigator.userAgent);


// run code once the window loads
window.addEventListener('load', function() {

  //get elements
  let video = document.getElementById('myVideo');
  let canvas = document.getElementById('myCanvas');
  let captureImg = document.getElementById('captureImg');
  let flipButton = document.getElementById('flipButton');

  // what media we want
  let constraints = {
    audio: false,
    video: true
  };

  runStream();

  // if video is able to play
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

  //if user is on a mobile device
  //give them the option to flip the camera
  if (isMobile) {
    //flip camera mode
    flipButton.addEventListener('click', function() {
      //switch to outward facing camera
      if (frontCam) {
        constraints = {
          audio: false,
          video: {
            facingMode: {
              exact: "environment"
            }
          }
        };
        frontCam = !frontCam;
      } else {
        //switch to default (selfie cam)
        constraints = {
          audio: false,
          video: true
        };
        frontCam = !frontCam;
      }
      //restart the video stream
      runStream();
    });
  } else {
    //hide the button if not running on mobile device
    flipButton.style.visibility = "hidden"
  }


  //when you click on send button
  captureImg.addEventListener('click', function() {
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
    let currentTime = new Date();
    let currentEpochTime = new Date().getTime();
    //create object to send
    let imgObject = {
      filename: "img_" + currentEpochTime + ".jpg",
      dataURL: imgDataURL,
      hour: currentTime.getHours(),
      minute: currentTime.getMinutes(),
      second: currentTime.getSeconds()
    };
    console.log(imgObject);
    //send object
    socket.emit('webcamImg', imgObject);

  });

  function runStream() {
    //reset video stream
    video.pause();
    video.src = "";
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
  }

});
