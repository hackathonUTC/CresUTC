app.factory('Categorie', ['$resource', function($resource){
  return $resource('/categorie/:id', {id : '@id'}, {
    update: {method: 'PUT'}
  });
}])
