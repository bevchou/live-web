// Require HTTPS & file system
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('/root/itp_io_cert/my-key.pem'),
  cert: fs.readFileSync('/root/itp_io_cert/my-cert.pem')
};

var httpServer = https.createServer(options, requestHandler);
var url = require('url');
httpServer.listen(8081);

function requestHandler(req, res) {
  var parsedUrl = url.parse(req.url);
  console.log("The Request is: " + parsedUrl.pathname);
  fs.readFile(__dirname + parsedUrl.pathname,
    // Callback function for reading
    function(err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedUrl.pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(data);
    }
  );
}

//database code
var Datastore = require('nedb');
var db = new Datastore({
  filename: "data.db",
  autoload: true
});


// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// when client connects
io.sockets.on('connection', function(socket) {
  console.log("We have a new client: " + socket.id);

  // whens someone sends a video
  socket.on('videoBlob', function(data) {
    console.log('got video: ' + data.filename);

    //write file
    fs.writeFileSync(__dirname + "/vids/" + data.filename, data.blobData);
    //create object for database
    let objectToDb = {
      filename: "/vids/" + data.filename,
      time: data.time
    };
    //store object to database
    db.insert(objectToDb, function(err, newDocs) {
      if (err != null) {
        console.log("err:" + err);
        console.log("newDocs: " + newDocs);
      }
    });

    //get a new photo from the database
    //get all of the database
    db.find({}, function(err, docs) {
      //find the total number of images & pick one at random
      let totalImgs = docs.length;
      let index = getRndInteger(0, totalImgs - 1);
      console.log(totalImgs, index);
      //send the file path of random img to client
      console.log("sending img: " + docs[index].filename);
      socket.emit('returnFile', docs[index]);
    });

  });


  socket.on('disconnect', function() {
    console.log("Client has disconnected " + socket.id);
  });
});

//get a random integer between min & max
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
