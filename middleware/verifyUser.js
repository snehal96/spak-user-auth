const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../model");
const compareAsc = require("date-fns/compareAsc");
const UserSession = db.usersession;

verifyToken = async (req, res, next) => {
	let token = req.headers["x-access-token"];

	if (!token) {
		return res.status(401).send({ message: "Authentication Failure" });
	}

	jwt.verify(token, config.secret, async (err, decoded) => {
		if (err) {
			console.log(err);
			return res.status(403).send({ message: "Authorization Failure!" });
		}

		await UserSession.findOne({ token: req.headers["x-access-token"] }).exec(async (err, obj) => {
			if (err || !obj || !obj.username) {
				return res.status(401).send({ message: "Authentication Failure" });
			}

			if (compareAsc(new Date(), obj["expiry"]) !== 1);
			else return res.status(401).send({ message: "Authentication Failure" });
		});

		next();
	});
};

const authJwt = {
	verifyToken,
};

module.exports = authJwt;
