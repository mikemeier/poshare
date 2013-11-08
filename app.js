var io = require('socket.io').listen(3000);
var randomstring = require('randomstring');

io.sockets.on('connection', function(socket){
    var id = randomstring.generate();
    socket.set('id', id);

    socket.on('position', function(position){
        socket.get('id', function(err, id){
            io.sockets.emit('position', {id: id, position: position});
        });
    });

    socket.on('disconnect', function(){
        socket.get('id', function(err, id){
            io.sockets.emit('position', {id: id, position: null});
        });
    });
});