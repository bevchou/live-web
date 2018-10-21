// Require HTTPS & file system
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('/root/itp_io_cert/my-key.pem'),
  cert: fs.readFileSync('/root/itp_io_cert/my-cert.pem')
};

var httpServer = https.createServer(options, requestHandler);
var url = require('url');
httpServer.listen(8080);

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

db.find({}, function(err, docs) {
  console.log(docs);
});

// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// when client connects
io.sockets.on('connection', function(socket) {
  console.log("We have a new client: " + socket.id);

  // whens someone sends a video frame
  socket.on('webcamImg', function(data) {
    // Send it to all of the clients
    // io.sockets.emit('webcamImg', data);
    console.log('got img');
    let dataURL = data.dataURL;
    //convert data URL to img
    let searchFor = "data:image/jpeg;base64,";
    let strippedImage = dataURL.slice(dataURL.indexOf(searchFor) + searchFor.length);
    let binaryImage = new Buffer(strippedImage, 'base64');
    //write file
    fs.writeFileSync(__dirname + "/imgs/" + data.filename, binaryImage);
    //create object for database
    let objectToDb = {
      filename: __dirname + data.filename,
      hour: data.hour,
      minute: data.minute,
      second: data.second
    };
    //store object to database
    db.insert(objectToDb, function(err, newDocs) {
      if (err != null) {
        console.log("err:" + err);
        console.log("newDocs: " + newDocs);
      }
    });

  });


  socket.on('disconnect', function() {
    console.log("Client has disconnected " + socket.id);
  });
});
