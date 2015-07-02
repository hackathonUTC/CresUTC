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

	function loadCategorie() {
		Categorie.get({id: catId}, function(categorie){
			$scope.cat_name = categorie.name;
		})
	}

	loadCategorie();

	$scope.editerArticle = function(p) {
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
			$http.post('/caisse/pushArticle', p)
			.success(function(data, status, headers, config) {
			})
			.error(function(data, status, headers, config) {
				loadCategorie();
			});
		});
	}

	$scope.ajouterArticle = function() {
		var p = {
			name: '',
			prix: 0,
			type: 'objet',
			categorie: catId,
		}

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
			$http.post('/caisse/newArticle', p)
			.success(function(data, status, headers, config) {
				loadCategorie();
			})
			.error(function(data, status, headers, config) {
				loadCategorie();
			});
		})
	}

	$scope.supprimerProduit = function(p) {
		$http.post('/caisse/deleteArticle', {id: p.id})
		.success(function(data, status, headers, config) {
			loadCategorie();
		})
		.error(function(data, status, headers, config) {
			loadCategorie();
		});
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
