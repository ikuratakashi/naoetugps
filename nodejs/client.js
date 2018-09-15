

//設定ファイルの読み込み
require('dotenv').config();

var fs = require('fs');
var ssl_server_key = '../../ssl/server.key';
var ssl_server_crt = '../../ssl/server.crt';
var options = {
    key: fs.readFileSync(ssl_server_key),
    cert: fs.readFileSync(ssl_server_crt),
    pfx: fs.readFileSync(ssl_server_crt),
    passphrase: process.env.HTTPS_PASS
};

var client = require('socket.io-client');
var socket = client.connect('https://localhost:3000',options);

socket.on('connect',function(){
    console.log('yea!!');
    socket.send('how are you?');
    socket.disconnect();
    process.exit(0);
});