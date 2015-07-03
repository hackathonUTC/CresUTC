var express = require('express');
var router = express.Router();
var orm = require('../orm.js');
var util = require('util');
var produit = require('./produit.js');

//Section routage

router.param('id', function(req, res, next, id){
  if(/^[0-9]+$/.test(id)){
    orm.Categorie.findById(id).then(function(categorie){
      if(categorie == null){
        res.status(404).json({error: 'Categorie not found'});
      }
      else {
        req.categorie = categorie;
        next();
      }
    }).catch(function(error) {
      res.status(500).json({error: 'Database error'});
    })
  }
  else {
    res.status(400).json({error : 'id must be a number'});
  }
})

router.get('/', allCategorie);
router.get('/:id', getCategorie)
router.post('/', createCategorie);
router.put('/:id', updateCategorie);
router.use('/:id/produits', produit)

module.exports  = router;

//Section implementation

function allCategorie(req, res) {
  orm.Categorie.findAll({attributes: ['id', 'name']}).then(function(categories){
    res.status(200).json(categories);
  })
}

function getCategorie(req, res) {
  res.status(200).json(req.categorie.toJSON());
}

function createCategorie(req, res) {
  orm.Categorie.create({name: req.body.name}).then(function(categorie){
    res.status(200).json(categorie);
  }).catch(function(error) {
    res.status(500).json({error: error});
  })
}

function updateCategorie(req, res) {
  req.categorie.set('name', req.body.name);
  req.categorie.save().then(function() {
    res.status(200).json({error: 'ok'});
  }).catch(function(error){
    res.status(500).json({error: 'Databse error'});
  })
}
