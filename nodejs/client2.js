var net = require('net');

var client = new net.Socket();
client.setEncoding('utf8');

var opt = {
    host:"https://arukisoft.com:30000/namehoge"
};

client.connect(opt, function(){
  console.log('client-> connected to server');
  client.write('Who needs a browser to communicate?');
});

process.stdin.resume();

process.stdin.on('data', function(data){
    console.log('client.write(data) : data = [' + data + ']');
    try{
        client.write(data);
    }catch(e){
        console.log('on data : error = [' + e + ']');
    }
});
client.on('error', function(error){
    console.log('client error-> ' + error);
  });
  
client.on('data', function(data){
  console.log('client data-> ' + data);
});

client.on('close', function(){
  console.log('client close-> connection is closed');
});