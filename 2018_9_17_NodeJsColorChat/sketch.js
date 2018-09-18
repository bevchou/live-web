//connect client to websocket
var socket = io.connect();
socket.on('connect', function() {
  console.log("Connected");
});

// Receive from any event
socket.on('colorMessage', function(data) {
  console.log(data);
  //split the data into an array [name, color]
  let dataArray = data.split(',');
  let name = dataArray[0];
  let color = dataArray[1];
  let txtColor = dataArray[2];
  //change the chat body color
  chatBody.style.backgroundColor = "#" + color;
  //change text to contrast the body color
  chatBody.style.color = txtColor;
  //add message text to site
  let message = "<p>" + name + ": #" + color + "</p>";
  document.getElementById('chatBody').innerHTML += message;
});

var sendmessage = function(message) {
  console.log("colorMessage: " + message);
  socket.emit('colorMessage', message);
};


//GLOBAL VARIABLES
let username;
let myColor;

// run code once the window loads
window.onload = function() {
  console.log('window loaded');

  let getUser = document.getElementById("getUser");
  let getColor = document.getElementById("getColor");
  let colorEntry = document.getElementById("colorEntry");
  let chatBody = document.getElementById("chatBody");

  //get the user's name
  getUser.addEventListener('keyup', function(e) {
    event.preventDefault();
    if (event.keyCode === 13) {
      if (getUser.value == "") {
        //cannot send an empty string
        console.log("you must enter your name");
      } else {
        username = getUser.value;
        console.log("you are " + username);
        //remove username input
        getUser.style.display = "none";
        //show color input
        colorEntry.style.display = "block";
      }
    }
  });

  //get the color
  getColor.addEventListener('keyup', function(e) {
    event.preventDefault();
    if (event.keyCode === 13) {
      if (getColor.value == "") {
        //cannot send an empty string
        console.log("you must enter a color");
      } else {
        //check if color is hex
        if (isHex(getColor.value)) {
          myColor = getColor.value;
          //change the chat body color
          chatBody.style.backgroundColor = "#" + myColor;
          //change text to contrast the body color
          let textColor = newTextColor("#" + myColor);
          chatBody.style.color = textColor;
          //send data thru websocket
          let data = username + "," + myColor + "," + textColor;
          sendmessage(data);
          //display your message on the site
          let message = "<p>" + username + ": #" + myColor + "</p>";
          chatBody.innerHTML += message;
          //clear the input
          getColor.value = "";
        } else {
          console.log("you must enter a hex value");
          let errMessage = "<p>You must enter a hexadecimal color.</p>";
          chatBody.innerHTML += errMessage;
        }
      }
    }
  });
}


// credit: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
//convert color hex to rgb
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

//credit: https://trendct.org/2016/01/22/how-to-choose-a-label-color-to-contrast-with-background/
//pick the contrasting text color based on brightness
function newTextColor(hex) {
  let rgb = hexToRgb(hex);
  let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  if (brightness > 123) {
    return "black";
  } else {
    return "white";
  }
}

//credit: https://www.sitepoint.com/community/t/how-to-check-if-string-is-hexadecimal/162739
//check if input is a hex color
function isHex(color) {
  var re = /[0-9A-Fa-f]{6}/g;
  if (re.test(color)) {
    return true;
  } else {
    return false;
  }
}
