function setup(io){
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
}

module.exports = {setup: setup};