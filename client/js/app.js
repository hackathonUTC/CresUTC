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
		.when('/adminpanel/editCat/:catId', { //Pour gérer les articles d'une categorie
			templateUrl: 'admin_gerercategorie.html',
			controller: 'adminpanel_gerer_categorie'
		})
		.when('/adminpanel/journaldesventes', {
			templateUrl: 'admin_journaldesventes.html',
			controller: 'admin_journaldesventes'
		})
		.when('/adminpanel/gererusers', {
			templateUrl: 'admin_gereruser.html',
			controller: 'admin_gereruser'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
