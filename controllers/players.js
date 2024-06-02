const { Player } = require("../models");

module.exports = {
	cget: async (req, res, next) => {
		const players = await Player.findAll({
			attributes: { exclude: ["password", "createdAt", "updatedAt"] },
		});
		res.status(200).json(players);
	},
	iget: async (req, res, next) => {
		const player = await Player.findByPk(req.params.id, {
			attributes: { exclude: ["password", "createdAt", "updatedAt"] },
		});
		if (player) res.json(player);
		else res.sendStatus(404);
	},
	patch: async (req, res, next) => {
		const player = await Player.findByPk(req.params.id);
		if (!player) return res.sendStatus(404);
		try {
			const [_, players] = await Player.update(req.body, {
				where: {
					id: req.params.id,
				},
				individualHooks: true,
				returning: true,
			});

			if (players.length) res.sendStatus(200);
		} catch (error) {
			res.sendStatus(400);
		}
	},
	delete: async (req, res, next) => {
		const nbDeleted = await Player.destroy({
			where: {
				id: req.params.id,
			},
		});
		if (!nbDeleted) {
			res.sendStatus(404);
		}
		console.log(nbDeleted);
		res.sendStatus(200);
	},
};
