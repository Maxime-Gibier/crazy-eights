const { Router } = require("express");
const PlayerController = require("../controllers/players");
const router = new Router();
const authWare = require("../middlewares/authWare");

// GET : list all players
router.get("", PlayerController.cget);

// GET : fetch an user by id
router.get("/:id", PlayerController.iget);
// PATCH : modify an user by id
router.patch("/:id", PlayerController.patch);
// DELETE : delete an user by id
router.delete("/:id", PlayerController.delete);

module.exports = router;
