var parameters = require('./parameters');

var googleapis = require('googleapis');
var OAuth2Client = googleapis.OAuth2Client;

module.exports = {createInstance: function(){
    return new OAuth2Client(parameters.oauth.key, parameters.oauth.secret, 'http://'+ parameters.http.hostname +':'+ parameters.http.port +'/auth')
}};