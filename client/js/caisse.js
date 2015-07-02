app.controller('caisse', ['$scope', '$http', '$modal', 'jwtHelper', '$cookies', '$location', 'Categorie', function($scope, $http, $modal, jwtHelper, $cookies, $location, Categorie) {
	$scope.categorie = [];

	$scope.ticket = [];

	$scope.products = [];
	$scope.currentCategorie = 0;

	var jwtToken = $cookies.get('token');
	var userInfo = jwtHelper.decodeToken(jwtToken);

	$scope.isAdmin = (userInfo.rights == 'admin');

	$scope.prix = function () {
		var prix = 0.0;

		angular.forEach($scope.ticket, function(produit, key){
			prix += parseFloat(produit.prix);
		});

		return prix;
	}

	$scope.supprimerProduit = function(p) {
		$scope.ticket.splice($scope.ticket.indexOf(p), 1);
	};

	$scope.ajouterProduit = function(produit) {

		if(produit.type == 'objet') {

			var produitDuTicket = $scope.ticket;
			for (var i = produitDuTicket.length - 1; i >= 0; i--) {
				if(produitDuTicket[i].produit == produit.name)
				{
					produitDuTicket[i].quantite++;
					produitDuTicket[i].prix += produit.prix;

					return;
				}
			}

			var p = {
				id: produit.id,
				produit: produit.name,
				quantite: 1,
				prix: produit.prix,
			};

			$scope.ticket.push(p);
		}
		else {
			var price_dialog = $modal.open({
				templateUrl: 'dialog_set_price.html',
				controller: 'setPrice',
				resolve: {
					p_id : function() { return produit.id; },
					p_name : function() { return produit.name; }
				}
			});

			price_dialog.result.then(function (produit) {
				var p = {
					id: produit.p_id,
					produit: produit.p_name,
					quantite: 1,
					prix: produit.price
				};

				$scope.ticket.push(p);
			})
		}
	};

	$scope.switchOnglet = function(i) {
		$scope.products = $scope.categorie[i].produits;
	};

	$scope.clearAllLines = function() {
		$scope.ticket.splice(0, $scope.ticket.length);
	}

	function loadCaisse() {
		Categorie.query(function(categories){
			$scope.categorie = categories;
		});
	}

	loadCaisse();

	$scope.venteEspece = function() {
		openModal('/dialog_espece.html', 'espece');
	};

	$scope.venteCB = function() {
		openModal('/dialog_carte_bancaire.html', 'carte');
	};

	$scope.venteCheque = function() {
		openModal('/dialog_cheque.html', 'cheque');
	};

	$scope.logout = function() {
		$cookies.remove('token');
	}

	function openModal(template, moyenPaiement) {
		var modalInstance = $modal.open({
			templateUrl: template,
			controller: 'venteModal',
			resolve: {
				prix: function() {
					return $scope.prix()
				}
			}
		});

		modalInstance.result.then(function() {
			var vente = {
				moyenPaiement: moyenPaiement,
				prixTotal: $scope.prix(),
				detail: $scope.ticket
			}

			$http.post('/caisse/vente', vente)
			.success(function(data, status, headers, config) {

			})
			.error(function(data, status, headers, config) {

			});

			$scope.ticket = [];
		})
	}
}]);

app.controller('venteModal', function($scope, $modalInstance, prix) {

	$scope.prix = prix;

	$scope.ok = function() {
		$modalInstance.close();
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
})

app.controller('setPrice', function($scope, $modalInstance, p_id, p_name) {
	$scope.produit = p_name;
	$scope.prix = 0;

	$scope.ok = function() {
		$modalInstance.close({p_id : p_id, p_name : p_name, price : $scope.prix});
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}


})
