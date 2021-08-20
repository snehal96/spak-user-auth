const authJwt = require("../middleware/verifyUser");
const checkUsername = require("../middleware/verifySignUp");
const controller = require("../controller/user.controller");

module.exports = (app) => {
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");

		next();
	});

	app.get("/api/users", [authJwt.verifyToken], controller.getAllUser);
	app.get("/api/user/:search", [authJwt.verifyToken], controller.getUser);
	app.post("/api/user/signup", [checkUsername.checkDuplicateUsername], controller.userSignUp);
	app.post("/api/user/signin", controller.userSignIn);
	app.post("/api/user/signout", [authJwt.verifyToken], controller.userSignOut);
};
