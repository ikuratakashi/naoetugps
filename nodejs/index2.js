/*
//socketクライアント
var net = require('net');
var cl = new net.Socket();
cl.setEncoding('utf8');
cl.connect('50001',"localhost", function(){
    console.log('client-> connected to server');
    //socket.emit("gpswrite","aaaaa");

    var SendData = {
        "lat":1.1,
        "lng":2.1,
        "type":1
    }

    cl.write("SendData");
    console.log('client-> emit end');
});
cl.on('error', function(e){
    console.log('client-> ' + e);
  });
cl.on('data', function(data){
  console.log('client-> ' + data);
});
cl.on('close', function(){
  console.log('client-> connection is closed');
});
*/
var io = require('socket.io-client');
var socket = io.connect('localhost:50001/naoetugps');
 
socket.on('connect',function(){
  console.log("connect!!");
});

socket.on('connect_error',function(e){
  console.log("error!! - " + e);
});

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other evenr', {my: 'data'});
});
