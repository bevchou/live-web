var express = require ('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(8080);

app.use(express.static('public'));

console.log("server running");


var io = socket(server);

io.on('connection',newConnection);

function newConnection(socket) {
	//console.log(socket);
	console.log('new connection:' + socket.id);


	socket.on('mouse', mouseMsg);

	function mouseMsg(data){
		socket.broadcast.emit('mouse', data);
		//io.sockets.emit('mouse',data);
		console.log(data);
	}

}
