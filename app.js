var parameters = require('./parameters');
var httphandler = require('./httphandler');

var app = require('http').createServer(httphandler);
var io = require('socket.io').listen(app);

var socket = require('./socket');
socket.setup(io);

var webRTC = require('webrtc.io');

app.listen(parameters.socket.port);
webRTC.listen(parameters.rtc.port);