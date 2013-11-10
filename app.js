var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var randomstring = require('randomstring');
var fs = require('fs');
var webRTC = require('webrtc.io');

app.listen(9000);
webRTC.listen(9001);

function handler(req, res){
    fs.readFile(__dirname +'/index.html', function(err, data){
        if(err){
            res.writeHead(500);
            res.end('Error loading index.html');
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
};

io.set('authorization', function(handshakeData, cb){
    var query = handshakeData.query;

    if(!query.username){
        return cb('parameters invalid', false);
    }

    handshakeData.username = query.username;

    cb(null, true);
});

io.sockets.on('connection', function(socket){
    socket.on('position', function(position){
        io.sockets.emit('position', {id: socket.handshake.username, position: position});
    });

    socket.on('disconnect', function(){
        io.sockets.emit('position', {id: socket.handshake.username, position: null});
    });
});