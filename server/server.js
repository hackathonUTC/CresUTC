var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser')
var caisse = require('./caisse.js');
var path = require('path');
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
app.get('/', cas.bounce, caisse.loadCaisse);
app.get('/caisse/load/', caisse.checkToken, caisse.initCaisse);
app.post('/caisse/vente/', caisse.checkToken, caisse.vente);
app.get('/caisse/categorie/', caisse.checkToken, caisse.loadCategorie);
app.post('/caisse/ajouterCategorie/', caisse.checkToken, caisse.ajouterCategorie);
app.get('/caisse/categorieDetail/', caisse.checkToken, caisse.categorieDetail);
app.post('/caisse/pushArticle', caisse.checkToken, caisse.pushArticle);
app.post('/caisse/newArticle', caisse.checkToken, caisse.newArticle);
app.post('/caisse/deleteArticle', caisse.checkToken, caisse.deleteArticle);
app.use('*', function(req, res){
	res.status(404).send("Not found :(");
});

app.listen(8080, function(){
	console.log('Server started on port 8080');
});