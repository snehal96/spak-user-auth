require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

var app = express();

const db = require("./model/index");
const mongoUrl = `mongodb+srv://admin:admin@spakchallenge.dxfgx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

db.mongoose
	.connect(mongoUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Successfully connected to MongoDB");
	})
	.catch((err) => {
		console.error("Connections error", err);
		process.exit();
	});

var corsOptions = {
	origin: "http://localhost:4000",
};

app.set("view engine", "ejs");

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(logger("dev"));

app.get("/", (req, res) => {
	res.render("index.ejs");
});

require("./routes/user.routes")(app);

let port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Listening on ${process.env.HOST}:${port}`);
});
