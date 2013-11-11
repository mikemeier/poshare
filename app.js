/**
 * Parameters
 */
var parameters = require('./parameters');

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var connect = require('connect');
var sessionStore = new connect.session.MemoryStore();

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var socket = require('./socket')(io, sessionStore);

// all environments
app.set('port', parameters.http.port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.favicon());

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser(parameters.cookie.secret));
app.use(express.session({
    key: parameters.session.key,
    store: sessionStore
}));

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if('development' == app.get('env')){
    app.use(express.errorHandler());
}

app.all('*', function(req, res, next){
    if(req.path == '/auth'){
        if(req.session.oauth){
            return res.redirect('/');
        }
        return next();
    }

    if(req.session.oauth){
        return next();
    }

    res.redirect('/auth');
});
app.get('/', routes.index);
app.get('/auth', routes.auth);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port '+ app.get('port'));
});