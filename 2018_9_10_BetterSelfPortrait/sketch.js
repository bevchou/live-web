let video;
let buttons;
//total video length in seconds
let videoLength = 570;

let row = 10;
let col = 10;

let words = ["the", "be", "to", " of ", "and", "a", " in ", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"];


window.addEventListener('load', function() {
  video = document.getElementById("myVideo");
  buttons = document.getElementById("buttons");

  let buttonW = row * 20; + "px";
  let buttonH = col * 20 + "px";
  buttons.style.width = buttonW;
  buttons.style.height = buttonH;

  for (let i = 0; i < words.length; i++) {
    let buttonHTML = "<button onclick='setVidTime(" + i + ")'>" + words[i] + "</button>";
    buttons.innerHTML += buttonHTML;
  }

});

function setVidTime(wordNum) {
  video.currentTime = wordNum * 1.495;
  video.play();
  setTimeout(function(){ video.pause(); }, 1450);
}
