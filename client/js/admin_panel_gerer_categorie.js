app.controller('adminpanel_gerer_categorie', ['$scope', 'Categorie', '$routeParams', '$modal', function($scope, Categorie, $routeParams, $modal) {
	$scope.produits = [
		{
			id: 1,
			name: 'Tête de yoda',
			prix: 3.45,
			type: 'objet'
		}
	];

	$scope.cat_name = '';

	var catId = $routeParams.catId;
	var produitsRes = Categorie.getProduitsRessource(catId);

	function loadCategorie() {
		Categorie.get({id: catId}, function(categorie){
			$scope.cat_name = categorie.name;
			produitsRes.query(function(produits){
				$scope.produits = produits;
			})
		})
	}

	loadCategorie();

	$scope.editerArticle = function(p) {
		var produitIndex = $scope.produits.indexOf(p);
		var dialog = $modal.open({
			templateUrl: 'dialog_edit_article.html',
			controller: 'dialog_edit_article',
			resolve: {
				p : function() {
					return p;
				}
			}
		})

		dialog.result.then(function(p) {
			p.$update(function(produitMisAJour){
				$scope.produits[produitIndex] = produitMisAJour;
			});
		});
	}

	$scope.ajouterArticle = function() {

		var p = new produitsRes();
		p.name = '';
		p.prix = 0;
		p.type = 'produit';
		p.icon = null;

		var dialog = $modal.open({
			templateUrl: 'dialog_edit_article.html',
			controller: 'dialog_edit_article',
			resolve: {
				p : function() {
					return p;
				}
			}
		})

		dialog.result.then(function(p) {
			p.$save(function(produitTuple){
				$scope.produits.push(produitTuple);
			});
		})
	}

	$scope.supprimerProduit = function(p) {
		var produitIndex = $scope.produits.indexOf(p);
		p.$delete(function(){
			$scope.produits.splice(produitIndex, 1);
		})
	};
}]);

app.controller('dialog_edit_article', ['$scope', 'p', '$modalInstance', '$http', function($scope, p, $modalInstance, $http) {
	$scope.p = p;

	$scope.ok = function() {
		$modalInstance.close($scope.p);
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
}])
