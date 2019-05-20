const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const keys = require("../../config/keys")

//Load input validation
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")

//Load User model
const User = require("../../models/User")

/*	Create the Register endpoint
	For our requester endpoint, we will
*	pull the errors and isValid variables from our validateRegisterInput(req.body) function and check input validation
*	If valid input, use MongoDB's User.findOue() to see if the user already exists
*	If user is a new user, fill in the fields (name, email, password) with data sent in the body of the request
*	Use bcryptjs to hash the password before storing it in the db
*/

// @route POST api/users/register
// @desc Register User
// @acceess Public

router.post("/register", (req, res) => {
	// Form validation

	const { errors, isValid } = validateRegisterInput(req.body)

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res.status( 400 ).json({ email: "Email already exists"})
		}

		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		})

		// Salt password before saving in DB
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash
				newUser
					.save()
					.then(user => res.json(user))
					.catch(err => console.log(err))
			})
		})
	})
})

/*	Create the Login endpoint
From our login endpoint we will:
*	Pull the errors and isValid variables from our validateLoginInput(req.body) function and check input validation
*	If valid input, use MongoDB's User.findOne() to see if the user exists
*	If user exists, use bcryptjs to compare submitted password with hashed password in db
* 	If passwords match create our JWT Payload
*	Sign the JWT, including: payload, keys.secretOrKey from keys.js, and setting an expy time
*	If sucessful, append the token to a Bearer string (opts.jwtFromRequest)
*/

// 	@route 		POST api/users/login
// 	@desc 		Login user and return JWT token
//	@acceess	Public
router.post("/login", (req, res) => {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body);

	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email
	const password = req.body.password

	// Find user by email
	User.findOne({ email }).then(user => {
		// Check if user exists
		if(!user) {
			return res.status(404).json({ emailnotfound: "Email not found"})
		}//if

		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// User matched
				// Create JWT Payload
				const payload = {
					id: user.id,
					name: user.name
				};

				//Sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 31556926 //1 year in seconds
					},
					(err, token) => {
						res.json({
							success: true,
							token: "Bearer " + token
						});
					}
				) //jwt.sign
			} else {
				return res
					.status(400)
					.json({ passwordincorrect: "Password incorrect" })
			}//if
		}) //bcrypt.compare
	})//User.findOne
})//router.post

module.exports = router
