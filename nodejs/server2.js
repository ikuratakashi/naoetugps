var net = require('net');
var client = require('socket.io-client');

var server = net.createServer(function(conn){

    console.log('server-> tcp server created');
    conn.setEncoding("utf8");  // as String

    var options = {
        secure:true,
        reconnect: true,
        rejectUnauthorized : false
    };

    //socket.io-clientでサーバへ接続
    var socket = client.connect('https://localhost:30000/namespace',options);

    //処理
    socket.on('connect',function(){
        console.log('connect: https://localhost:30000/namespace');
        //socket.disconnect();
        //process.exit(0);
    });

    socket.on('connect_error',function(e){
        console.log('connect_error e=' + e);
    });

    conn.on('data', function(data){
        var line = data.toString();
        socket.send(line);
        console.log('server->[' + line + ']');
        console.log('server->' + 'remoteAddress[' + conn.remoteAddress + ']');
        console.log('server->' + 'remotePort[' + conn.remotePort + ']');
        //conn.write('server -> Repeating: ' + data);
    });

    conn.on('close', function(){
        console.log('server-> client closed connection');
    });

}).listen(30001);

console.log('listening on port 30001');