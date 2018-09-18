//設定ファイルの読み込み
require('dotenv').config();

var fs = require('fs');
var ssl_server_key = '../../ssl/new_server.key';
var ssl_server_crt = '../../ssl/server.crt';
var options = {
//    key: fs.readFileSync(ssl_server_key),
//    cert: fs.readFileSync(ssl_server_crt),
//    pfx: fs.readFileSync(ssl_server_crt),
//    passphrase: process.env.HTTPS_PASS,
    secure:true,
    reconnect: true,
    rejectUnauthorized : false
};

//socket.io-clientでサーバへ接続
var client = require('socket.io-client');
var socket = client.connect('https://arukisoft.com:30000/namespace',options);

//処理
//connectしたら'how are you?'とメッセージを送信する
socket.on('connect',function(){
    console.log('yea!!');
    socket.send('how are you2?');
    //socket.disconnect();
    process.exit(0);
});

socket.on('connect_error',function(e){
    console.log('connect_error e=' + e);
});
