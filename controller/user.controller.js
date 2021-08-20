const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adddate = require("date-fns/add");

const config = require("../config/auth.config");
const db = require("../model/index");
const User = db.user;
const UserSession = db.usersession;

exports.userSignUp = (req, res) => {
	const newUser = new User({
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 10),
		name: req.body.name,
		contact: req.body.contact,
		address: req.body.address,
		gender: req.body.gender,
		country: req.body.country,
	});

	newUser.save((err, obj) => {
		if (err) {
			if (process.env.Mode == "dev") console.log(err);
			res.status(400).send({ message: "Some Error Occurred! Please try again later." });
		}

		res.status(201).send({ message: "User registered successfully!" });
	});
};

exports.userSignIn = (req, res) => {
	User.findOne({ username: req.body.username }).exec((err, user) => {
		if (err) {
			if (process.env.Mode == "dev") console.log(err);
			res.status(400).send({ message: "Some Error Occurred! Please try again later." });
		}

		if (!user.password) {
			res.status(401).send({ message: "Username not found!" });
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			res.status(401).send({ message: "Invalid Credentials" });
		}

		var token = jwt.sign({ id: user.id }, config.secret, {
			expiresIn: process.env.TOKEN || 900,
		});

		var session = new UserSession({
			token: token,
			username: req.body.username,
			expiry: adddate(new Date(), { minutes: 15 }),
		});

		session.save((err, obj) => {
			if (err) console.log(err);
			res.status(200).send({
				message: "Successfully Logged In",
				name: user.name,
				accessToken: token,
			});
		});
	});
};

exports.userSignOut = (req, res) => {
	console.log(req.headers["x-access-token"]);
	UserSession.deleteOne({ token: req.headers["x-access-token"] }).exec((err, obj) => {
		if (err) {
			if (process.env.Mode == "dev") console.log(err);
			res.status(400).send({ message: "Some Error Occurred! Please try again." });
		}

		res.status(201).send({ message: "Successfully LoggedOut" });
	});
};

exports.getAllUser = (req, res) => {
	User.find({}, { username: 0, password: 0, _id: 0, __v: 0 }).exec((err, obj) => {
		if (err) {
			if (process.env.Mode == "dev") console.log(err);
			res.status(400).send({ message: "Some Error Occurred! Please try again." });
		}

		res.status(200).send(obj);
	});
};

exports.getUser = (req, res) => {
	var q = req.params.search;
	// var isNum = true;

	let query = [];
	if (!isNaN(q)) query.push({ contact: q });

	query.push({ name: { $regex: q, $options: "i" } });

	User.find(
		{
			$or: query,
		},
		{ username: 0, password: 0, _id: 0, __v: 0 }
	).exec((err, obj) => {
		if (err) {
			if (process.env.MODE == "dev") console.log(err);
			res.status(400).send({ message: "Some Error Occurred! Please try again." });
		}

		res.status(200).send(obj);
	});
};
