//socketクライアント
var net = require('net');
var cl = new net.Socket();
cl.setEncoding('utf8');
cl.connect('50001', 'localhost', function(){
    console.log('client-> connected to server');
    cl.write('Who needs a browser to communicate?');
});
process.stdin.resume();
process.stdin.on('data', function(data){
    cl.write(data);
});
cl.on('data', function(data){
  console.log('client-> ' + data);
});
cl.on('close', function(){
  console.log('client-> connection is closed');
});
