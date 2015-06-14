app.controller('admin_gereruser', ['$scope', '$http', function($scope, $http) {
	$scope.users = [];

	function loadUsers() {
		$http.get('/caisse/allUsers')
		.success(function(data, status, headers, config) {
			$scope.users = data;
		})
		.error(function(data, status, headers, config) {
		});
	}

	$scope.sauverUser = function (u) {
		$http.post('/caisse/saveUser', u)
		.success(function(data, status, headers, config) {
			loadUsers();
		})
		.error(function(data, status, headers, config) {
			loadUsers();
		});
	}

	loadUsers();
}])