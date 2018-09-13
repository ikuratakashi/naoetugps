var _io = require('socket.io-client');

var _url = "https://arukisoft.com:50001/naoetugps";
var _so = _io.connect(_url);
_so.on('connect', function (pData){
    naoetu.log.out(3,'io-client  :  connect ' + pData);
    IoNaoetuGps.emit('gpswrite finish',{msg:"naoetu.GpsWrite emit"});
});
