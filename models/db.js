const Sequelize = require("sequelize");

const connection = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "postgres",
});

connection.authenticate().then(() => console.log("Database connected"));

module.exports = connection;
