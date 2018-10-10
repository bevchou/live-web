// Require HTTPS & file system
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
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


// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// when client connects
io.sockets.on('connection', function(socket) {
  console.log("We have a new client: " + socket.id);

  // whens someone sends a video frame
  socket.on('dataURL', function(data) {
    // Send it to all of the clients
    io.sockets.emit('dataURL', data);
  });


  socket.on('disconnect', function() {
    console.log("Client has disconnected " + socket.id);
  });
});
