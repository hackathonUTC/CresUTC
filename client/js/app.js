var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'angular-jwt', 'ngCookies']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'caisse.html',
			controller: 'caisse'
		})
		.when('/adminpanel', {
			templateUrl: 'adminpanel.html',
		})
		.when('/adminpanel/gerercaisse', {
			templateUrl: 'admin_gerercaisse.html',
			controller: 'admin_panel_gerer_caisse'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
