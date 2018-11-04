//connect client to websocket
var socket = io.connect();
socket.on('connect', function() {
  console.log("Connected");
});

socket.on('returnImg', function(data) {
  console.log(data);
  showImg.src = data.filename;
  showImg.style.visibility = "visible";
  video.style.visibility = "hidden";
});

//GLOBAL VARIABLES
// image or video dimensions
let width = 600;
let height;
//camera settings
let streaming = false;
let frontCam = true;
let isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(navigator.userAgent);
let videoMode = true;
let video = null;
// chunks of data for the video blob
let myStream = null;


// run code once the window loads
window.addEventListener('load', function() {

  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;



  //get elements
  video = document.getElementById('myVideo');
  let canvas = document.getElementById('myCanvas');
  let capture = document.getElementById('capture');
  let flipButton = document.getElementById('flipButton');
  let showImg = document.getElementById('showImg');


  //hide image
  //show video
  setCameraMode();

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
    flipButton.style.visibility = "hidden";
  }


  //when you click on send button
  capture.addEventListener('click', function() {
    if (videoMode) {
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
      let currentDate = new Date();
      let currentTime = currentDate.getTime();
      let totSecs = getTotalSeconds(currentDate);
      //create object to send
      let imgObject = {
        filename: "img_" + currentTime + ".jpg",
        dataURL: imgDataURL,
        epochTime: currentTime,
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes(),
        second: currentDate.getSeconds(),
        totalSeconds: totSecs
      };
      // console.log(imgObject);
      //send object
      socket.emit('webcamImg', imgObject);
      setImgMode();
    } else {
      setCameraMode();
    }

  });



  //function to start the getting the video feed
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

  function setCameraMode() {
    capture.innerHTML = "capture";
    showImg.style.visibility = "hidden";
    video.style.visibility = "visible";
    flipButton.style.visibility = "visible";
    videoMode = true;
  }

  function setImgMode() {
    flipButton.style.visibility = "hidden";
    capture.innerHTML = "done";
    videoMode = false;
  }

  function getVideoClip() {
    let chunks = [];
    let mediaRecorder = new MediaRecorder(stream);
    console.log(mediaRecorder);
    //when recording is done
    mediaRecorder.addEventListener('stop', function(e) {
      console.log('stop');
      let newVid = document.createElement('video');
      newVid.controls = true;
      let blob = new Blob(chunks, {
        'type': 'video/webm'
      });
      let videoURL = window.URL.createObjectURL(blob);
      newVid.src = videoURL;

      document.body.appendChild(newVid);
    });
    //put data chunks into array
    mediaRecorder.addEventListener('dataavailable', function(e) {
      console.log('data available');
      chunks.push(e.data);
    });

    mediaRecorder.start();

    //record only two seconds
    setTimeout(function() {
      mediaRecorder.stop();
    }, 2000);
  }

});
