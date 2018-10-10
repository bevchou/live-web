var socket;
// let dotColor = "white"
let dotColor = "#fffff";

function setup() {
  createCanvas(600, 600);
  background(51);
  //var the socket variable and connect to the server
  socket = io.connect('http://bc2542.itp.io:8080')
  // socket.on('mouse', newDrawing);

  socket.on('mouse', function(data) {
    noStroke();
    fill(dotColor);
    ellipse(data.x, data.y, 5, 5);
  });

}

// function newDrawing(data) {
//   noStroke();
//   fill(dotColor);
//   ellipse(data.x, data.y, 5, 5);
// }
//name of the msg which is a string of a name, and data for the msg ou want to send
function mouseDragged() {
  fill(dotColor);
  console.log('Sending: ' + mouseX + ',' + mouseY);
  var data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data);
  noStroke();
  ellipse(mouseX, mouseY, 5, 5);
}


function draw() {

}

function setColor() {
  console.log("changed");
  const e = document.getElementById("colors");
  const color = e.options[e.selectedIndex].text;
  //console.log(color)
  switch (color) {
    case "red":
      dotColor = "#ff0000";
      break;
    case "green":
      dotColor = "#41f458";
      break;
      // dotColor = "lime"
    case "yellow":
      dotColor = "#f4be41";
      break;

  }


}
