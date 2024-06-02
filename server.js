require("dotenv").config();
const express = require("express");
const PlayersRouter = require("./routes/players");
const AuthRouter = require("./routes/auth");
const GameRouter = require("./routes/game");
const AuthWare = require("./middlewares/authWare");
const router = express.Router();

const app = express();

app.use(express.json());

app.use(AuthRouter);
app.use("/players", AuthWare, PlayersRouter);
app.use("/game", AuthWare, GameRouter);

app.listen(process.env.PORT, () =>
	console.log("Server listening on port " + process.env.PORT)
);
