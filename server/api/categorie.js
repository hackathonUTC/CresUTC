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
})

router.get('/', allCategorie);
router.get('/:id', getCategorie)
router.post('/', createCategorie);
router.put('/:id', updateCategorie);

module.exports  = router;

//Section implementation

function allCategorie(req, res) {
  orm.Categorie.findAll({attributes: ['id', 'name']}).then(function(categories){
    res.status(200).json(categories);
  })
}

function getCategorie(req, res) {
  orm.Categorie.findById(req.id).then(function(categorie){
    if(categorie == null){
      res.status(404).json({status: 'Categorie not found'});
    }
    else {
      res.status(200).json(categorie);
    }
  })
}

function createCategorie(req, res) {
  orm.Categorie.create({name: req.body.name}).then(function(categorie){
    res.status(200).json(categorie);
  }).catch(function(error) {
    res.status(500).json({error: error});
  })
}

function updateCategorie(req, res) {
  orm.Categorie.update({name: req.body.name}, {where: {
    id: req.params.id
  }}).then(function() {
    res.sendStatus(200);
  }).catch(function(error){
    res.status(500).json({error: error});
  });
}
