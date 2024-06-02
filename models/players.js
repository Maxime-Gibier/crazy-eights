const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = function PlayerModelGenerator (connection) {
	class Player extends Model {}

	Player.init(
		{
			id: {
				type: DataTypes.UUID,
				unique: true,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			pseudo: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: 8,
					is: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/,
				},
			},
		},
		{
			sequelize: connection,
			modelName: "Player",
		}
	);

	Player.addHook("beforeCreate", async (player) => {
		player.password = await bcrypt.hash(
			player.password,
			await bcrypt.genSalt()
		);
	});
	Player.addHook("beforeUpdate", async (player, options) => {
		if (options.fields.includes("password"))
			player.password = await bcrypt.hash(
				player.password,
				await bcrypt.genSalt()
			);
	});

	return Player;
};
