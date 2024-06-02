const { Model, DataTypes } = require("sequelize");

module.exports = function GameModelGenerator(connection) {
	class Game extends Model {}

	Game.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
			},
			player1: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			player2: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			winner: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			currentTurn: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "player1",
			},
			board: {
				type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
				allowNull: true,
				defaultValue: [
					["", "", ""],
					["", "", ""],
					["", "", ""],
				],
			},
		},
		{
			sequelize: connection,
			modelName: "Game",
		}
	);

	return Game;
};
