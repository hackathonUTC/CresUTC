var express = require('express');
var router = express.Router();
var orm = require('../orm.js');

//Routing section

router.param('id', function(req, res, next, id) { //Middleware de validation. Vérifie qu'id est bien une chaine alphanumérique
  console.log(id);
  if(/^[a-z][a-z0-9]{1,9}$/.test(id)) {
    req.id = id;
    next();
  }
  else
    res.status(500).json({error : "Id must be an alphanum string"});
})

router.get('/', function(req, res){
  res.redirect('/user/page/1');
})
router.get('/:id', getUserById);


module.exports  = router;

function getUserById(req, res) {
  orm.User.findById(req.id, {attributes : [
    'cas_login', 'rights'
  ]}).then(function(user) {
    if(user == null){
      res.status(404).json({error: 'User not found'});
    }
    else{
      res.status(200).json(user);
    }
  })
}
