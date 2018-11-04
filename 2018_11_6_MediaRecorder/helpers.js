//EXTRA HELPER FUNCTIONS

//get total seconds out of the entire day
//input a javascript date object
function getTotalSeconds(currentTime) {
  return currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
}
