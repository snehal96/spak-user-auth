const db = require("../model/index");
const User = db.user;

exports.checkDuplicateUsername = (req, res, next) => {
	// console.log(req);
	//Username
	User.findOne({
		username: req.body.username,
	}).exec((err, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}

		if (user) {
			res.status(400).send({ message: "Failed! Username already exist" });
			return;
		}

		next();
	});
};
