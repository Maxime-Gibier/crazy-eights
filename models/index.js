const connection = require("./db");
const PlayerModel = require("./players")(connection);
const GameModel = require("./game")(connection);

module.exports = {
	db: connection,
	Player: PlayerModel,
	Game: GameModel,
};
