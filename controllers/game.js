const { Game } = require("../models");
const { Player } = require("../models");

module.exports = {
	hostGame: async (req, res) => {
		do {
			game_id = (Math.floor(Math.random() * 89999) + 10000).toString();
		} while (await Game.findByPk(game_id));
		const newGame = {
			id: game_id,
			player1: req.body.player.id,
			winner: null,
		};
		await Game.create(newGame);
		res.status(201).json(newGame);
	},

	getGames: async (req, res) => {
		const games = await Game.findAll({
			where: {
				player2: null,
			},
		});
		res.json(games);
	},

	joinGame: async (req, res) => {
		const game = await Game.findOne({
			where: {
				id: req.params.gameId,
				player2: null,
			},
		});

		if (game && game.player1 !== req.body.player.id) {
			await game.update({ player2: req.body.player.id });
			res.send("Game joined successfully");
		} else {
			res.redirect("/join");
		}
	},

	playMove: async (req, res) => {
		const game = await Game.findByPk(req.params.gameId);
		console.log(game.board);
		if (!game) {
			return res.status(404).json({ message: "Game not found" });
		}

		if (
			game.player1 !== req.body.player.id &&
			game.player2 !== req.body.player.id
		) {
			return res
				.status(403)
				.json({ message: "You are not a player in this game" });
		}

		if (game.winner) {
			return res.status(400).json({ message: "Game is already finished" });
		}

		const currentPlayer = await Player.findByPk(req.body.player.id);
		console.log(game.player1);
		console.log(game.player2);
		console.log(currentPlayer.id);
		console.log(game.currentTurn);

		if ((currentPlayer.id == game.player1 && game.currentTurn != "player1") || (currentPlayer.id == game.player2 && game.currentTurn != "player2")) {
			return res.status(400).json({ message: "It's not your turn" });
		} else {
			await game.update({
				currentTurn: game.currentTurn === "player1" ? "player2" : "player1",
			});
		}
		const { row, col } = req.body;
		if (row < 0 || row > 2 || col < 0 || col > 2) {
			return res.status(400).json({ message: "Invalid move" });
		}

		const board = game.board;
		if (board[row][col] !== "") {
			return res.status(400).json({ message: "Invalid move" });
		}
		
		board[row][col] = currentPlayer.pseudo;
		await Game.update({
			board 
		}, {
			where: {
				id: req.params.gameId,
			},
		});
		console.log(game.board);

		// Check for a win
		const winningCombinations = [
			// Rows
			[
				[0, 0],
				[0, 1],
				[0, 2],
			],
			[
				[1, 0],
				[1, 1],
				[1, 2],
			],
			[
				[2, 0],
				[2, 1],
				[2, 2],
			],
			// Columns
			[
				[0, 0],
				[1, 0],
				[2, 0],
			],
			[
				[0, 1],
				[1, 1],
				[2, 1],
			],
			[
				[0, 2],
				[1, 2],
				[2, 2],
			],
			// Diagonals
			[
				[0, 0],
				[1, 1],
				[2, 2],
			],
			[
				[0, 2],
				[1, 1],
				[2, 0],
			],
		];

		for (const combination of winningCombinations) {
			const [a, b, c] = combination;
			if (
				board[a[0]][a[1]] === board[b[0]][b[1]] &&
				board[a[0]][a[1]] === board[c[0]][c[1]] &&
				board[a[0]][a[1]] !== ""
			) {
				const winner = board[a[0]][a[1]];
				await game.update({ winner });
				return res.status(200).json({ message: "Game finished", winner });
			}
		}

		// Check for a draw
		if (board.flat().every((cell) => cell !== "")) {
			await game.update({ winner: "draw" });
			return res.status(200).json({ message: "Game finished", winner: "draw" });
		}
		res.status(200).json({ message: "Move played successfully" });
	},
};
