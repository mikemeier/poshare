var cookie = require('cookie');
var connect = require('connect');
var googleapis = require('googleapis');
var randomstring = require("randomstring");

var oauth = require('./oauth');
var parameters = require('./parameters');

var store = null;
var io = null;

function getSession(sessionId, cb){
    store.get(sessionId, cb);
}

function socketSessionHelper(socket){
    return function(cb){
        return function(){
            var args = Array.prototype.slice.call(arguments);
            getSession(socket.handshake.sessionId, function(err, session){
                args.unshift(err, session);
                cb.apply(null, args);
            });
        };
    }
}

function setup(){
    io.set('authorization', function(data, accept){
        if(!data.headers.cookie){
            return accept('Session cookie required.', false);
        }

        var cookieData = cookie.parse(data.headers.cookie);
        var signedCookieData = connect.utils.parseSignedCookies(cookieData, parameters.cookie.secret);
        var sessionId = signedCookieData[parameters.session.key];

        getSession(sessionId, function(err, session){
            if(err){
                return accept(err, false);
            }

            if(!session){
                return accept('No session data or session id invalid.', false);
            }

            data.sessionId = sessionId;
            data.oauth = session.oauth;
            data.id = randomstring.generate();

            return accept(null, true);
        });
    });

    io.sockets.on('connection', function(socket){
        socket.on('disconnect', function(){
            io.sockets.emit('position', null, {id: socket.handshake.id, position: null});
        });

        var helper = socketSessionHelper(socket);

        var oauthClient = oauth.createInstance();
        oauthClient.credentials = {
            access_token: socket.handshake.oauth.access_token
        };

        googleapis
            .discover('plus', 'v1')
            .execute(function(err, client){
                client
                    .plus.people.get({userId: 'me'})
                    .withAuthClient(oauthClient)
                    .execute(function(err, data){
                        if(err){
                            return socket.emit('position', err);
                        }
                        socket.on('position', helper(function(err, session, position){
                            io.sockets.emit('position', err, {id: socket.handshake.id, image: data.image.url, name: data.displayName, position: position});
                        }));
                    });
            });
    });
}

module.exports = function(socketIo, sessionStore){
    io = socketIo;
    store = sessionStore;
    setup();
};