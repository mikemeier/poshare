var fs = require('fs');
var url = require('url');
var path = require('path');

var handler = function handler(req, res){
    var file = null;

    try {
        file = path.normalize(decodeURI(url.parse(req.url).pathname));
    }catch(e){}

    if(file == null || file == '/'){
        file = '/index.html';
    }

    fs.readFile(__dirname +'/public'+ file, function(err, data){
        if(err){
            res.writeHead(500);
            res.end('Error loading '+ file);
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
};

module.exports = handler;