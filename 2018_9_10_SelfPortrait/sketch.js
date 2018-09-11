let button;
let video;
//total video length in seconds
let videoLength = 570;
//distance from close div
let distance;
//mouse position
let mX, mY;

window.addEventListener('load', function() {
  video = document.getElementById("myVideo");

  //TEST BUTTON
  // button = document.getElementById('test');
  // button.addEventListener('click', function(e) {
  //   console.log('you clicked this button');
  //   video.currentTime = 3;
  // });


  let exit = document.getElementById('closeVid');

  window.addEventListener('mousemove', function(e) {
    mX = e.pageX;
    mY = e.pageY;
    distance = calculateDistance(exit, mX, mY);
    // console.log(distance);
    let ratio = distance / window.innerWidth;
    video.currentTime = (1 - ratio) * videoLength;
  });

  exit.addEventListener('click', function(e) {
    console.log('close!');
    let everything = document.getElementById('everything');
    everything.remove();
    self.close();
    // window.location.href = "chrome://version/";
  });

});




//function to calculate distance from mouse to any element
function calculateDistance(elem, mouseX, mouseY) {
  return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offsetLeft + (elem.offsetWidth / 2)), 2) + Math.pow(mouseY - (elem.offsetTop + (elem.offsetHeight / 2)), 2)));
}
