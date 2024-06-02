const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Player } = require("../models");

module.exports = {
	login: async (req, res, next) => {
		const { email, password } = req.body;

		const player = await Player.findOne({
			where: {
				email: email,
			},
		});
		
		if (!player) return res.sendStatus(401);
		if ((await bcrypt.compare(password, player.password)))
			return res.sendStatus(401);

		const token = jwt.sign(
			{
				playerID: player.id,
				fullName: `${player.lastname} ${player.firstname}`,
			},
			process.env.JWT_SECRET
		);

		res.json({ token });
    },
    register: async (req, res, next) => {
		const { email, password, pseudo } = req.body;
		
		const existingPlayer = await Player.findOne({
			where: {
				email: email,
			},
		});
		if (existingPlayer) {
			return res.status(409).json({ message: "Email already in use" });
		}
        const player = await Player.create({
            email,
            password: await bcrypt.hash(password, 10),
            pseudo,
        });
        res.json(player);
    },
};
