const express = require("express");
const router = express.Router();
const GameController = require("../controllers/game");


router.post("/host", GameController.hostGame);

router.get("/join", GameController.getGames);

router.post("/join/:gameId", GameController.joinGame);

router.post("/play/:gameId", GameController.playMove);

module.exports = router;
