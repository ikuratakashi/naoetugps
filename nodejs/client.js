var client = require('socket.io-client');
var socket = client.connect('https://arukisoft.com:3000/naoetugps');
socket.on('connect',function(){
    console.log('yea!!');
    socket.send('how are you?');
    socket.disconnect();
    process.exit(0);
});