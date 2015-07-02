app.controller('admin_panel_gerer_caisse', ['$scope', 'Categorie', '$modal', function($scope, Categorie, $modal) {
	$scope.categorie = []

	$scope.ajouterCategorie = function() {
		var dialogAjouterCat = $modal.open({
			templateUrl: 'dialog_ajouter_categorie.html',
			controller: 'dialog_ajouter_categorie'
		});

		dialogAjouterCat.result.then(function(catName) {
			var categorie = new Categorie();
			categorie.name = catName;
			categorie.$save(function(newCat) {
				$scope.categorie.push(newCat);
			})
		});
	}

	function loadCategorie() {
		Categorie.query(function(categories){
			$scope.categorie = categories;
		})
	}

	loadCategorie();
}]);

app.controller('dialog_ajouter_categorie', ['$scope', '$modalInstance', function($scope, $modalInstance) {
	$scope.cat_name = '';

	$scope.ok = function() {
		$modalInstance.close($scope.cat_name);
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
}]);
