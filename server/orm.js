var Sequelize = require('sequelize');
var sequelize = new Sequelize('cresutc_orm', 'root', 'mxd351Rt', {
	host: 'localhost',
	dialect: 'mariadb',
	pool: {
		max: 5,
		min: 0,
		timeout: 10000
	},
	define: {
		timestamps: false,
		allowNull: false
	}
});

exports.initModel = function() {
	exports.User = sequelize.define('user', {
		cas_login: {
			type: Sequelize.STRING(10),
			primaryKey : true,
			isAlphanumeric: true
		},
		rights: {
			type: Sequelize.ENUM('client', 'vendeur', 'admin'),
			defaultValue: 'client',
		}
	});

	exports.Categorie = sequelize.define('categorie', {
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: Sequelize.STRING(45),
			allowNull: false,
			unique: true
		}
	});

	exports.Produit = sequelize.define('produit', {
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.STRING(45),
			allowNull: false,
			unique: true
		},
		prix: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0.0
		},
		icon: {
			type: Sequelize.STRING(256),
			allowNull: true,
		},
		type: {
			type: Sequelize.ENUM('produit', 'service'),
			allowNull: false,
			defaultValue: 'produit'
		}
	});

	exports.Categorie.hasMany(exports.Produit);
	exports.Produit.belongsTo(exports.Categorie);

	exports.Vente = sequelize.define('vente', {
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		total: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		date: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('NOW'),
		},
		vendor: {
			type: Sequelize.STRING(10),
			allowNull: false,
		},
		moyenPaiement: {
			type: Sequelize.ENUM('espece', 'cb', 'cheque'),
			allowNull: false,
		}
	});
	var produitVendu = sequelize.define('produitVendu', {
		name: {
			type: Sequelize.STRING(45),
			allowNull: false,
		},
		quantite: {
			type: Sequelize.INTEGER.UNSIGNED,
			allowNull: false,
		},
		prix: {
			type: Sequelize.FLOAT,
			allowNull: false,
		}
	});

	exports.Vente.hasMany(produitVendu);

	sequelize.sync({force: false});
}
