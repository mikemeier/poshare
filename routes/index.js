var parameters = require('../parameters');
var oauth = require('../oauth').createInstance();

exports.index = function(req, res){
    res.render('index', {
        hostname: parameters.http.hostname,
        port: parameters.http.port
    });
};

exports.auth = function(req, res){
    if(!req.query.code){
        return res.redirect(oauth.generateAuthUrl({
            scope: 'https://www.googleapis.com/auth/plus.me'
        }));
    }
    oauth.getToken(req.query.code, function(err, tokens){
        if(err){
            return res.send(500, err);
        }
        req.session.oauth = tokens;
        res.redirect('/');
    });
};