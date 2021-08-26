module.exports = (sequelize, DataTypes) => {
	const Recipe = sequelize.define("Recipe", {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				max: 50,
			},
		},
		description: {
			type: DataTypes.TEXT("long"),
			allowNull: false,
		}
	}, {});

	Recipe.associate = models => {
		Recipe.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		})
	}

	return Recipe;
};
