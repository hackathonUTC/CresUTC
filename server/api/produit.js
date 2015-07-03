var express = require('express');
var router = express.Router();
var orm = require('../orm.js');

//Section routage

router.param('id', function(req, res, next, id){
  if(/^[0-9]+$/.test(id)){
    req.id = id;
    next();
  }
  else {
    res.status(400).json({error : 'id must be a number'});
  }
});

router.get('/', getProduits);
router.post('/', createProduit);
router.put('/:id', updateProducts);
router.delete('/:id', deleteProduit);

module.exports = router;

//Section implémentation

function getProduits(req, res){
  req.categorie.getProduits().then(function(produit){
    if(produit == null){
      res.status(200).json([]);
    }
    else {
      res.status(200).json(produit)
    }
  }).catch(function(error) {
    res.status(500).json({error: 'Database error'});
  });
}

function createProduit(req, res){
  var nouveauProduit = {
    name: req.body.name,
    prix: req.body.prix,
    type: req.body.type,
    icon: req.body.icon == '' ? null : req.body.icon,
  }

  req.categorie.createProduit(nouveauProduit).then(function(newProduit){
    res.status(200).json(newProduit.toJSON());
  }).catch(function(){
    res.status(500).json({error : 'Database error'});
  });
}

function updateProducts(req, res){
  orm.Produit.findById(req.id).then(function(produit){
    if(produit == null){
      res.status(404).json({error: 'Produit not found'});
    }
    else{
      produit.name = req.body.name;
      produit.prix = req.body.prix;
      produit.type = req.body.type;
      produit.icon = req.body.icon == '' ? null : req.body.icon;

      produit.save().then(function(produitTupleMisAJour){
        res.status(200).json(produitTupleMisAJour.toJSON());
      }).catch(function(){
        res.status(500).json({error : 'Database error'});
      });
    }
  }).catch(function(){
    res.status(500).json({error : 'Database error'});
  });
}

function deleteProduit(req, res){
  orm.Produit.findById(req.id).then(function(produit){
    if(produit == null){
      res.status(404).json({error: 'Produit not found'});
    }
    else{
      produit.destroy().then(function(){
        res.status(200).json({});
      })
      .catch(function(){
        res.status(500).json({error: 'Database error'});
      });
    }
  }).catch(function(){
    res.status(500).json({error: 'Database error'});
  })
}
