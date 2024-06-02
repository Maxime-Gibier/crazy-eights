const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthController = require("../controllers/auth");

// Route d'inscription
router.post("/register", AuthController.register);

// Route de connexion
router.post("/login", AuthController.login);

module.exports = router;
