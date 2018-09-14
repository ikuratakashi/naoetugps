var express = require('express');
var app = express();

//クロスサイト制限を外す設定
var cors = require('cors');
app.use(cors());

app.get('/', function(req, res) {
	res.render('index.ejs', {
		layout : false
	});
});

//設定ファイルの読み込み
require('dotenv').config();

//SSL サーバ起動
var https = require('https');
var fs = require('fs');
var ssl_server_key = '../../ssl/server.key';
var ssl_server_crt = '../../ssl/server.crt';
var options = {
        key: fs.readFileSync(ssl_server_key),
        cert: fs.readFileSync(ssl_server_crt),
        passphrase: process.env.HTTPS_PASS
};
var server = https.createServer(options, app);
server.listen(3000,function(){
    console.log(3,'Start https server port:3000');
});

//socket.io作成（redis込み）
var socketIo = require('socket.io')();
var io = socketIo.listen(server);

console.log('Server running at https://127.0.0.1:3000/');

io.sockets.on('connection', function(client) {
	client.on('message', function(msg) {
		client.send(msg);
		client.broadcast.emit('message', msg);
	});
});