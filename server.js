const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const passport = require("passport")

const users = require("./routes/api/users")

const app = express();

//Bodyparser middleware
app.use(
	bodyParser.urlencoded({
		extended:false
	})
);
app.use(bodyParser.json())

// DB CONFIG
const db = require("./config/keys").mongoURI

// DB CONNECT
mongoose
	.connect(
		db,
		{ useNewUrlParser: true}
	)
	.then(() => console.log("Candygram for Mongo!"))
	.catch(err => console.log(err));

// Passport middleware (what does that mean?!)
app.use(passport.initialize())

// Passport config
require("./config/passport")(passport) //what is this syntax?!

// Routes
app.use("/api/users", users)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server awaiting further orders on port ${port}!`))