const mongoose = require("mongoose");

const UserSession = mongoose.model(
	"UserSession",
	mongoose.Schema({
		token: String,
		username: String,
		expiry: Date,
	})
);

module.exports = UserSession;
