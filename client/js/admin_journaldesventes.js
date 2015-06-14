app.controller('admin_journaldesventes', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
	$scope.journal = [];

	function loadVente() {
		$http.get('/caisse/journaldesventes')
		.success(function(data, status, headers, config) {
			$scope.journal = data;
		})
		.error(function(data, status, headers, config) {
		});
	}

	loadVente();

	$scope.voirDetail = function(vente) {
		$modal.open({
			templateUrl: 'dialog_detail_vente.html',
			controller: 'dialog_detail_vente',
			resolve: {
				vente: function() {
					return vente;
				}
			}
		})
	}
}])

app.controller('dialog_detail_vente', ['$scope', '$http', 'vente', '$modalInstance', function($scope, $http, vente, $modalInstance) {
	$scope.detail = [];

	$scope.ok = function() {
		$modalInstance.close();
	}

	$http.get('/caisse/detailVente', {params: {id: vente.id}})
	.success(function(data, status, headers, config) {
		$scope.detail = data;
	})
	.error(function(data, status, headers, config) {

	});
}])