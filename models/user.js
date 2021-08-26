const bcryptjs = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define("User", {
		user_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		email: {
			type: Sequelize.STRING,
		},
		password: {
			type: Sequelize.STRING,
		},
	}, {});

	User.associate = models => {
		User.hasMany(models.Recipe, {
			onDelete: "cascade" // If the user is deleted, it will delete all the recipes associated with it
		})
	}

	User.beforeCreate((user, options) => {
		return bcryptjs
			.hash(user.password, 10)
			.then((hash) => {
				user.password = hash;
			})
			.catch((err) => {
				throw new Error();
			});
	});

	User.prototype.comparePassword = function (pw, callback) {
		let err, pass;
		if (!this.password) return false;

		bcryptjs.compare(pw, this.password, callback);
	};

	// User.prototype.verifyCredentials = function(loginData, callback) {
	// if(!loginData.username || !loginData.password) return callback('Please provide email and password');
	// }

	return User;
};
