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
cl.connect('https://arukisoft.com:50001/naoetugps' , function(){
    console.log('client-> connected to server');

    cl.write('Who needs a browser to communicate?');
});
cl.on('data', function(data){
  console.log('client-> ' + data);
});
cl.on('close', function(){
  console.log('client-> connection is closed');
});
