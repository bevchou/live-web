// LINKS
// THE BEST: https://whatwebcando.today
// https://stackoverflow.com/questions/18643766/find-and-replace-specific-text-characters-across-a-document-with-js
// https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
// https://developer.mozilla.org/en-US/docs/Web/API/Text
// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementsFromPoint
// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint

// GLOBAL VARIABLES
let luxLevel = null;
let peerInfo = {
  myPeerId: null,
  peerIdToCall: null
};


window.addEventListener('load', function() {
  let peer = null;
  let connection = null;

  //divs
  let myIdDiv = document.getElementById("myIdDiv");
  let idToCallDiv = document.getElementById("idToCallDiv");

  //inputs
  let myId = document.getElementById("myId");
  let idToCall = document.getElementById("idToCall");


  //get id when the user hits enter
  myId.addEventListener('keyup', function(e) {
    e.preventDefault();
    if (e.keyCode === 13 && this.value != "") {
      peerInfo.myPeerId = myId.value;
      initPeerConnection();
      // myIdDiv.style.visibility = "hidden";
      // idToCallDiv.style.visibility = "visible";
    }
  });

  idToCall.addEventListener('keyup', function(e) {
    e.preventDefault();
    if (e.keyCode === 13 && this.value != "") {
      peerInfo.peerIdToCall = idToCall.value;
      makeCall();
      // idToCallDiv.style.visibility = "hidden";
    }
  });

  //get all text nodes in the webpage
  var textnodes = textNodesUnder(document.body);
  // console.log(textnodes);
  for (let i = 0; i < textnodes.length; i++) {
    //new element for each node
    let newNode = document.createElement('charGroup');
    newNode.innerHTML = textToParticle(textnodes[i].nodeValue);
    textnodes[i].parentNode.replaceChild(newNode, textnodes[i]);
    if (i == textnodes.length - 1) {
      allWords = document.getElementsByTagName('word');
      animateLetters();
      lightSensor();
      console.log('done converting elements');
    }
  }

  let initPeerConnection = function() {
    peer = new Peer(peerInfo.myPeerId, {
      host: 'bc2542.itp.io',
      secure: true,
      port: 9000,
      path: '/'
    });

    peer.on('error', function(err) {
      console.log(err);
    });

    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      peerInfo.myPeerID = id;
    });

    peer.on('connection', function(conn) {
      connection = conn;

      connection.on('open', function() {

        //get & send mouse data
        document.body.addEventListener('mousemove', function(e) {
          connection.send({
            x: e.clientX,
            y: e.clientY
          });
        });
      });

      connection.on('data', function(data) {
        //DO STUFF WITH DATA BEING RECEIVED
        if (data.otherUser){
          console.log('connected to ' + data.otherUser);
        }

        if (data.x && data.y){
          console.log(data.x, data.y);
        }


        //document.getElementById('chatlog').innerHTML += data;
        // document.getElementById('othermouse').style.position = "absolute";
        // document.getElementById('othermouse').style.left = data.x + "px";
        // document.getElementById('othermouse').style.top = data.y + "px";
      });

    });
  };

  let makeCall = function() {
    connection = peer.connect(peerInfo.peerIdToCall);

    connection.on('open', function(data) {
      console.log('connection established with ' + peerInfo.peerIdToCall);
      connection.send({
        otherUser: peerInfo.myPeerID
      })

      document.body.addEventListener('mousemove', function(e) {
        connection.send({x: e.clientX, y: e.clientY});
      })
    });

    connection.on('data', function(data) {
      console.log(data.x, data.y);
      //document.getElementById('chatlog').innerHTML += data;
      // document.getElementById('othermouse').style.position = "absolute";
      // document.getElementById('othermouse').style.left = data.x + "px";
      // document.getElementById('othermouse').style.top = data.y + "px";
    });
  };

  //modify css of elements
  function animateLetters() {
    document.addEventListener('mousemove', function(e) {
      //get all elements that collides with mouse
      let activeItems = document.elementsFromPoint(e.clientX, e.clientY);
      //only get the element that is a "character" element
      let letter = activeItems.find(letter => letter.localName == "character");
      if (letter) {
        let posData = letter.getBoundingClientRect();
        let dx = (e.x - posData.x) * 1.25;
        let dy = -(e.y - posData.y) * 1.25;

        // letter.style.transform = "translate(" + dx + "px," + dy + "px)";
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
        letter.animate([{
            transform: "translate(0px, 0px)"
          },
          {
            transform: "translate(" + dx + "px," + dy + "px )"
          },
          {
            transform: "translate(0px, 0px)"
          }
        ], {
          duration: 1200,
          easing: "ease-out",
        });
      }
    });
  }

  //modified from the "explosifyText" function from FontBomb: https://github.com/plehoux/fontBomb/blob/master/js/explosion.js
  //breaks text characters into indvidual elements
  function textToParticle(string) {
    var char, chars;
    chars = (function() {
      let ref = string.split('');
      let results = [];
      for (let i = 0; i < ref.length; i++) {
        char = ref[i];
        if (!/^\s*$/.test(char)) {
          results.push("<character style='display:inline-block;' class='dostuff animate'>" + char + "</character>");
        } else {
          results.push('&nbsp;');
        }
      }
      return results;
    })();
    chars = chars.join('');
    chars = (function() {
      let ref = chars.split('&nbsp;');
      let results = [];
      for (let i = 0; i < ref.length; i++) {
        char = ref[i];
        if (!/^\s*$/.test(char)) {
          results.push("<word style='white-space:nowrap'>" + char + "</word>");
        } else {
          results.push(char);
        }
      }
      return results;
    })();
    return chars.join(' ');
  };

  // https://stackoverflow.com/questions/22921242/remove-carriage-return-and-space-from-a-string
  // https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
  //gets all the text nodes on the page
  function textNodesUnder(el) {
    //get all the text nodes
    var n, a = [],
      b = []
    walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    while (n = walk.nextNode()) a.push(n);
    //remove all text nodes with whitespace or carriage return
    for (let i = 0; i < a.length; i++) {
      if (a[i].nodeValue.replace(/[\n\r]+/g, '')) {
        b.push(a[i]);
      }
    }
    return b;
  }

  // https://blog.arnellebalane.com/using-the-ambient-light-sensor-api-to-add-brightness-sensitive-dark-mode-to-my-website-82223e754630
  //may need to enable "Generic Sensor Extra Classes" under chrome flags
  //if light sensor is available
  function lightSensor() {
    if ('AmbientLightSensor' in window) {
      const sensor = new AmbientLightSensor();
      //when the reading changes
      sensor.onreading = () => {
        luxLevel = sensor.illuminance;
        // console.log('Current light level:', luxLevel);
        //change text opacity based on light reading
        if (luxLevel <= 35) {
          let scaleFactor = mapRange(luxLevel, 0, 40, 0.3, 1);
          // console.log(scaleFactor);
          //it's dark --> change text opacity
          for (i = 0; i < allWords.length; i++) {
            allWords[i].style.opacity = scaleFactor;
          }
        } else {
          //bright light
          document.body.style.opacity = 1;
          // document.body.style.color = "black";
        }
      };
      sensor.onerror = (event) => {
        console.log(event.error.name, event.error.message);
      };
      sensor.start();
    }
  }

});

//https://stackoverflow.com/questions/48802987/is-there-a-map-function-in-vanilla-javascript-like-p5-js
// linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}
