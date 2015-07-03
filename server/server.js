var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser')
var caisse = require('./caisse.js');
var path = require('path');
var orm = require('./orm.js');
var user = require('./api/user.js');
var categorie = require('./api/categorie.js');
var CASAuthentication = require('cas-authentication');

app.use( session({
    secret            : 'super secret key',
    resave            : false,
    saveUninitialized : true
}));

var cas = new CASAuthentication({
    cas_url     : 'https://cas.utc.fr/cas',
    service_url : 'http://localhost:8080',
    cas_version: '2.0',
    session_name    : 'cas_user'
});

orm.initModel();

app.use(morgan('dev'));
app.use(cookieParser());
/*.get('/', function(req, res) {
	res.sendFile(__dirname + '/../public/index.html', null, function (err) {
    	if (err) {
    	  console.log(err);
    	  res.status(err.status).end();
    	}
    	else {
    	  console.log('Sent:', fileName);
    	}
	});
})*/
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.resolve(__dirname, './../public')));
app.get('/logout/', cas.logout);
app.get('/', cas.bounce, caisse.checkRights, caisse.loadCaisse);

app.use('/user', user);
app.use('/categorie', categorie);
app.use('*', function(req, res){
	res.status(404).send("Not found :(");
});

app.listen(8080, function(){
	console.log('Server started on port 8080');
});
