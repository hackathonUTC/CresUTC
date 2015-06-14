app.controller('admin_panel_gerer_caisse', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
	$scope.categorie = []

	$scope.ajouterCategorie = function() {
		var dialogAjouterCat = $modal.open({
			templateUrl: 'dialog_ajouter_categorie.html',
			controller: 'dialog_ajouter_categorie'
		});

		dialogAjouterCat.result.then(function(catName) {
			$http.post('caisse/ajouterCategorie', {catName: catName})
			.success(function(data, status, headers, config) {
				loadCategorie();
			})
			.error(function(data, status, headers, config) {

			});
		})
	}

	function loadCategorie() {
		$http.get('caisse/categorie')
		.success(function(data, status, headers, config) {
			$scope.categorie = data;
		})
		.error(function(data, status, headers, config) {

		});
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