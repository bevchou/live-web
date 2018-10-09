// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');

//the port that the site will be served on
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

let userCount = 0;
let currentUsers = [];
let userNum;

// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// This is run for each individual user that connects
// We are given a websocket object in our function
io.sockets.on('connection', function(socket) {
  console.log("We have a new client: " + socket.id);
  userCount++;
	console.log(userCount);
	if (userCount > 2) {
		userCount--;
		let disconnected = true;
		socket.emit('forceDisconnect', disconnected);
		socket.disconnect();
	}

	//receive username from client, save the usernames
  socket.on('username', function(name) {
    console.log(name + " is here.");
    currentUsers.push(name);
		//broadcast the list of active users to all clients
		socket.broadcast.emit('currentUsers', currentUsers);
		console.log(currentUsers);
  });

  socket.on('disconnect', function() {
    userCount--;
    console.log("Client has disconnected " + socket.id);
  });
});
