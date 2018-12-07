// LINKS
// https://stackoverflow.com/questions/18643766/find-and-replace-specific-text-characters-across-a-document-with-js
// https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
// https://developer.mozilla.org/en-US/docs/Web/API/Text
// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementsFromPoint
// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint

// GLOBAL VARIABLES
let letterArray = [];



window.addEventListener('load', function() {

  // https://blog.arnellebalane.com/using-the-ambient-light-sensor-api-to-add-brightness-sensitive-dark-mode-to-my-website-82223e754630
  //may need to enable "Generic Sensor Extra Classes" under chrome flags
  //if light sensor is available
  if ('AmbientLightSensor' in window) {
    const sensor = new AmbientLightSensor();
    //when the reading changes
    sensor.onreading = () => {
      console.log('Current light level:', sensor.illuminance);
      if (sensor.illuminance <= 50) {
        let bgDarkness = mapRange(sensor.illuminance, 0, 50, 35, 255);
        // document.body.style.backgroundColor = "hsl(0, 100%," + bgDarkness + ")";
        document.body.style.backgroundColor = "rgb(" + bgDarkness + "," + bgDarkness + "," + bgDarkness + ")";
        if (bgDarkness <= 120) {
          let textColor = 255 - bgDarkness;
          document.body.style.color = "rgb(" + textColor + "," + textColor + "," + textColor + ")";
        }
      } else {
        document.body.style.backgroundColor = "white";
          document.body.style.color = "black";
      }

    };
    sensor.onerror = (event) => {
      console.log(event.error.name, event.error.message);
    };
    sensor.start();
  }

  //get all text nodes in the webpage
  var textnodes = textNodesUnder(document.body);
  console.log(textnodes);
  for (let i = 0; i < textnodes.length; i++) {
    //new element for each node
    let newNode = document.createElement('charGroup');
    newNode.innerHTML = textToParticle(textnodes[i].nodeValue);
    textnodes[i].parentNode.replaceChild(newNode, textnodes[i]);
    if (i == textnodes.length - 1) {
      changeLetters();
      console.log('done');
    }
  }

  //modify css of elements
  function changeLetters() {
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

});

//https://stackoverflow.com/questions/48802987/is-there-a-map-function-in-vanilla-javascript-like-p5-js
// linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}
