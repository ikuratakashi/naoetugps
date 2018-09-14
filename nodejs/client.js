var client = require('socket.io-client');
var socket = client.connect('localhost:3000');
socket.on('connect',function(){
    console.log('yea!!');
    socket.send('how are you?');
    socket.disconnect();
    process.exit(0);
});