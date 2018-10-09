//connect client to websocket
var socket = io.connect();
socket.on('connect', function() {
  console.log("Connected");
});

//if disconnected show message
socket.on('forceDisconnect', function(disconnected) {
  if (disconnected) {
    document.body.innerHTML = "<h1>There are too many users. Come back later!</h1>";
  }
});

//get list of active users (who is online)
socket.on('currentUsers', function(currentUsers) {
  console.log(currentUsers);
  activeUsers = currentUsers;
  showStatus();
});

//GLOBAL VARIABLES
let username;
let activeUsers = [];
let firstPersonsTurn = true;

// run code once the window loads
window.onload = function() {
  console.log('window loaded');

  let getUser = document.getElementById("getUser");
  let getUserText = document.getElementById("getUserText");
  let userStatus = document.getElementById("userStatus");
  let canvas = document.getElementById("canvas");

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
        getUserText.style.display = "none";
        //send the username to the server
        socket.emit('username', username);
        activeUsers.push(username);
        showStatus();
      }
    }
  });

}

function showStatus() {
  //show who's turn it is
  if (firstPersonsTurn && activeUsers.length == 2) {
    userStatus.innerHTML = "<p>It is " + activeUsers[0] + "'s turn.<br>" + activeUsers[1] + " is next.</p>";
    firstPersonsTurn = !firstPersonsTurn;
  } else if (!firstPersonsTurn && activeUsers.length == 2) {
    userStatus.innerHTML = "<p>It is " + activeUsers[1] + "'s turn.<br>" + activeUsers[0] + " is next.</p>";
    firstPersonsTurn = !firstPersonsTurn;
  } else {
    userStatus.innerHTML = "Waiting for someone to join you!";
  }
}

// function draw() {
//   canvas.addEventListener("mousedown", function(e) {
//     let mouseX = e.pageX - this.offsetLeft;
//     let mouseY = e.pageY - this.offsetTop;
//     canvas.arc(mouseX, mouseY, 4, 0, 360);
//   });
//
// }
