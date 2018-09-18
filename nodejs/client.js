var options = {
    secure:true,
    reconnect: true,
    rejectUnauthorized : false
};

//socket.io-clientでサーバへ接続
var client = require('socket.io-client');
var socket = client.connect('https://localhost:30000/namespace',options);

//処理
//connectしたら'how are you?'とメッセージを送信する
socket.on('connect',function(){
    socket.send('how are you?');
    //socket.disconnect();
    //process.exit(0);
});

socket.on('connect_error',function(e){
    console.log('connect_error e=' + e);
});
