var mypeerid = null;
var peer = null;
var connection = null;

var init = function() {
  peer = new Peer({
    host: 'bc2542.itp.io',
    port: 9000,
    path: '/'
  });

  peer.on('error', function(err) {
    console.log(err);
  });

  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    mypeerid = id;
  });

  peer.on('connection', function(conn) {
    connection = conn;

    connection.on('open', function() {
      document.getElementById('chatlog').innerHTML += "Connection Established";
      document.body.addEventListener('mousemove', function(evt) {
        connection.send({
          x: evt.clientX,
          y: evt.clientY
        });
      })
    });

    connection.on('data', function(data) {
      //document.getElementById('chatlog').innerHTML += data;
      document.getElementById('othermouse').style.position = "absolute";
      document.getElementById('othermouse').style.left = data.x + "px";
      document.getElementById('othermouse').style.top = data.y + "px";

    });
  });
};

var sendmessage = function() {
  connection.send(document.getElementById('chat').value);
  document.getElementById('chat').value = "";
};

var placecall = function() {
  connection = peer.connect(document.getElementById('other_peer_id').value);

  connection.on('open', function(data) {
    document.getElementById('chatlog').innerHTML += "Connection Established";
    document.body.addEventListener('mousemove', function(evt) {
      connection.send({
        x: evt.clientX,
        y: evt.clientY
      });
    })
  });

  connection.on('data', function(data) {
    //document.getElementById('chatlog').innerHTML += data;
    document.getElementById('othermouse').style.position = "absolute";
    document.getElementById('othermouse').style.left = data.x + "px";
    document.getElementById('othermouse').style.top = data.y + "px";
  });
};
