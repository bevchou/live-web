//connect client to websocket
var socket = io.connect();
socket.on('connect', function() {
  console.log("Connected");
});

// Receive from events
socket.on('webcamImg', function(data) {

});

socket.on('currentData', function(data) {
  console.log(data);

});

socket.on('theImg', function(data) {
  console.log(data);
  mainImg.src = data;
  //remove image after 1 second
  setTimeout(function() {
    mainImg.src = "";
  }, 999);
});

//GLOBAL VARIABLES
let width = 600;
let height;
let streaming = false;
let frontCam = true;
let isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(navigator.userAgent);
let time;


// run code once the window loads
window.addEventListener('load', function() {

  // if (window.innerWidth < 800) {
  //   width = window.innerWidth * 0.8;
  // } else {
  //   width = 800;
  // }

  //get elements
  let video = document.getElementById('myVideo');
  let canvas = document.getElementById('myCanvas');
  let captureImg = document.getElementById('captureImg');
  let flipButton = document.getElementById('flipButton');
  let showTime = document.getElementById('showTime');
  let mainImg = document.getElementById('mainImg');

  //check if there is an image at the current time
  //by querying the database every second
  function checkImgDb() {
    time = new Date();
    timeInSec = getTotalSeconds(time);
    showTime.innerHTML = timeInSec;
    socket.emit('timeUpdate', timeInSec);
  }
  setInterval(checkImgDb, 1000);

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
      // width = video.videoWidth / (video.videoHeight / height);
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
    let totSecs = getTotalSeconds(currentTime);
    //create object to send
    let imgObject = {
      filename: "img_" + totSecs + ".jpg",
      dataURL: imgDataURL,
      hour: currentTime.getHours(),
      minute: currentTime.getMinutes(),
      second: currentTime.getSeconds(),
      totalSeconds: totSecs
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
