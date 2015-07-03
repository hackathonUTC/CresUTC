app.factory('Categorie', ['$resource', function($resource){
  var res = $resource('/categorie/:id', {id : '@id'}, {
    update: {method: 'PUT'}
  });

  res.getProduitsRessource = function(catId) {
    return $resource('/categorie/:catId/produits/:id', {catId: catId, id: '@id'}, {
      update: {method: 'PUT'}
    });
  };

  return res;
}])
