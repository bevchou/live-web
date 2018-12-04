// links
// https://stackoverflow.com/questions/18643766/find-and-replace-specific-text-characters-across-a-document-with-js
// https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
// https://developer.mozilla.org/en-US/docs/Web/API/Text
// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementsFromPoint
// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint


let test = 0;

window.addEventListener('load', function() {


  var textnodes = nativeSelector();
  for (let i = 0; i < textnodes.length; i++) {
    let newNode = document.createElement('particles');
    newNode.innerHTML = explosifyText(textnodes[i].nodeValue);
    textnodes[i].parentNode.replaceChild(newNode, textnodes[i]);
  }



  // document.addEventListener('mousemove', function(e) {
  //   let activeItems = document.elementsFromPoint(e.x, e.y);
  //   test = activeItems;
  //   console.log(test);
  //   let letter = activeItems.find(letter => letter.localName == "particle");
  //   if (letter) {
  //     letter.style.color = "red";
  //   }
  //
  // });

  // for (var i = 0, len = textnodes.length; i < len; i++) {
  //   // stuff.push(textnodes[i].nodeValue);
  //   // textnodes[i].nodeValue = nv.replace(/£/g,'€');
  //   if (!/^\s*$/.test(textnodes[i].nodeValue)) {
  //     console.log(textnodes[i].nodeValue);
  //
  //     for (let j = 0; j < textnodes[i].length; j++) {
  //       // let newNode = document.createElement('particles');
  //       // newNode.innerHTML = textnodes[i][j];
  //       console.log(textnodes[i]);
  //       // textnodes[i].parentNode.replaceChild(newNode, textnodes[i]);
  //     }
  //
  //
  //
  //   }
  //
  // }

  // x = stuff[5];
  // console.log(x);
  // for (let i = 0; i < x.length; i++) {
  //   let newNode = document.createElement('particle');
  //   newNode.innerHTML = x[i];
  //   x.parentNode.replaceChild(newNode, x);
  // }

  //borrowed from https://github.com/plehoux/fontBomb/blob/master/js/explosion.js
  //look at "explosifyText" function
  function textToParticle(string) {
    var char, chars, index;
    chars = (function() {
      var i, len, ref, results;
      ref = string.split('');
      results = [];
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        char = ref[index];
        if (!/^\s*$/.test(char)) {
          results.push("<particle style='display:inline-block;'>" + char + "</particle>");
        } else {
          results.push('&nbsp;');
        }
      }
      return results;
    })();
    chars = chars.join('');
    chars = (function() {
      var i, len, ref, results;
      ref = chars.split('&nbsp;');
      results = [];
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        char = ref[index];
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

  //borrowed from some guy in this stackoverflow thread
  // https://stackoverflow.com/questions/18643766/find-and-replace-specific-text-characters-across-a-document-with-js
  function nativeSelector() {
    var elements = document.querySelectorAll("body, body *");
    var results = [];
    var child;
    for (var i = 0; i < elements.length; i++) {
      child = elements[i].childNodes[0];
      if (elements[i].hasChildNodes() && child.nodeType == 3) {
        results.push(child);
      }
    }
    return results;
  }

});
