var express = require('express');
var app = express();
app.get('/', function(req, res) {
	res.render('index.ejs', {
		layout : false,
		locals : {
			name : req.param('name') || 'anonymous'
		}
	});
});
app.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
var io = require('socket.io').listen(app);
io.sockets.on('connection', function(client) {
	client.on('message', function(msg) {
		client.send(msg);
		client.broadcast.emit('message', msg);
	});
});