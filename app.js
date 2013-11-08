var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var randomstring = require('randomstring');
var fs = require('fs');

app.listen(8080);

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