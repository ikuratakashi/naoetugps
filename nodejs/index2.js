var net = require('net');

/*
var server = net.createServer(function(conn){
  console.log('server-> tcp server created');

  conn.on('data', function(data){
    console.log('server-> ' + data + ' from ' + conn.remoteAddress + ':' + conn.remotePort);
    conn.write('server -> Repeating: ' + data);
  });
  conn.on('close', function(){
    console.log('server-> client closed connection');
  });
}).listen(3000);

console.log('listening on port 3000');
*/

//socketクライアント
var cl = new net.Socket();
cl.setEncoding('utf8');
cl.connect('50001',"loclhost", function(){
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
