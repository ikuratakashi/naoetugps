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
    rejectUnauthorized : false,
    namespace : "namespace"
};

//socket.io-clientでサーバへ接続
var client = require('socket.io-client');
var socket = client.connect('https://arukisoft.com:30000',options);
var nsp = socket;

//処理
//connectしたら'how are you?'とメッセージを送信する
nsp.on('connect',function(){
    console.log('yea!!');
    nsp.send('how are you?');
    nsp.disconnect();
    process.exit(0);
});

nsp.on('connect_error',function(e){
    console.log('connect_error e=' + e);
});
