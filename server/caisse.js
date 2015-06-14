var database = require('./database.js');
var jwt = require('jsonwebtoken');
var path = require('path');
var util = require('util');

var signatureKey = '4DUX&0#"{z7DZ7,7e+%SB3lcdp=2K)';

exports.checkToken = function(req, res, next) {
	var token = req.cookies.token;
	try {
  		var decoded = jwt.verify(token, signatureKey);
	} catch(err) {
  		return res.status(403).send("Forbidden");
	}

	next();
}

exports.loadCaisse = function(req, res) {

	var cas_user = req.session.cas_user;

	database.registerNewUser(cas_user, function(error){
		if(error){
			return res.status("500").send("Database error");
		}

		database.userRank(cas_user, function(error, rights) {
			if(error){
				return res.status("500").send("Database error");
			}

			var token = jwt.sign({user: cas_user, rights: rights}, signatureKey);

			res.cookie('token', token);
			res.sendFile(path.resolve(__dirname + '/../public/app.html'), {dotfiles: 'allow'});
		});

	});
}

exports.initCaisse = function(req, res) {

	database.getCaisseProducts(function(error, allCategorie) {
		if(error) {
			return res.status("500").send("Database error");
		}

		res.json(allCategorie);
	});
}

exports.vente = function (req, res) {

	var vente = req.body;

	database.ajouterVente(vente, function(err) {
		if(err){
			res.status(500).send("Error")
		}

		res.status(200).send("ok");
	})
}

exports.loadCategorie = function(req, res) {
	database.allCategorie(function(err, cat) {
		if(err) {
			return res.status("500").send("Database error");
		}

		res.json(cat);
	})
}

exports.ajouterCategorie = function(req, res) {
	database.addCategorie(req.body.catName, function(err) {
		if(err){
			return res.status(500).send("Error")
		}

		res.status(200).send("ok");
	})
}

exports.categorieDetail = function(req, res) {

	if(!req.query.id)
		return res.status(400).send("Bad request");

	database.categorieDetail(req.query.id, function(err, data) {
		if(err){
			return res.status(500).send(err);
		}

		res.json(data);
	})
}

exports.pushArticle = function(req, res) {
	if(!req.body)
		return res.status(400).send("Bad request");

	database.pushArticle(req.body, function(err) {
		if(err) {
			return res.status(500).send(err);
		}

		res.status(200).send("ok");
	});
}

exports.newArticle = function(req, res) {
	if(!req.body)
		return res.status(400).send("Bad request");

	database.newArticle(req.body, function(err) {
		if(err) {
			return res.status(500).send(err);
		}

		res.status(200).send("ok");
	});
}

exports.deleteArticle = function(req, res) {
	if(!req.body.id)
		return res.status(400).send("Bad request");

	database.deleteArticle(req.body.id, function(err) {
		if(err) {
			return res.status(500).send(err);
		}

		res.status(200).send("ok");
	});
}