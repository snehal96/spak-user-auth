const mongoose = require("mongoose");

const User = mongoose.model(
	"User",
	mongoose.Schema({
		username: String,
		password: String,
		name: String,
		contact: Number,
		address: String,
		gender: String,
		country: String,
	})
);

module.exports = User;
