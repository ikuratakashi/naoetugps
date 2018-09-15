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

//SSL サーバ作成
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

//socket.ioインスタンス作成
var socketIo = require('socket.io')();
var io = socketIo.listen(server);

//socket.ioスケールアウト
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

//スケールアウトの為sessionの共有
var cookieParser = require('cookie-parser')();
var session = require('cookie-session')({ secret: 'secret key'});
io.use(function(socket, next) {
    var req = socket.request;
    var res = {};
    cookieParser(req, res, function(err) {
        if(err) return next(err);
        session(req, res, next);
    });
});

//サーバ起動
server.listen(30000,function(){
    console.log('Start https server port:30000');
});

//名前空間
var io_name = io.of("/namehoge");
io_name.on('connection', function(client) {
	client.on('message', function(msg) {
		client.send(msg);
		client.broadcast.emit('message', msg);
	});
});