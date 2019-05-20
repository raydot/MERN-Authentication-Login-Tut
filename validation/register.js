/*	Our validation flow for register.js will go as follows
*	Pull in validaotr and is-empty dependencies
*	Export the function validateRegisterInput, which takes in data as a parameter send from reg form
*	Instantiate our errors object
*	Convert all empty fields to an empty string before runnning validation checks
*	Check for empty fields, valid email formats, pw requirements, and pw equality
* 	Return our errors object with any and all errors contained as well as an isValid boolean that checks to see it there are any errors
*/

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
	let errors = {};

	//Convert empty fields into an empty string for validator
	data.name = !isEmpty(data.name) ? data.name : ""
	data.email = !isEmpty(data.email) ? data.email : ""
	data.password = !isEmpty(data.password) ? data.password : ""
	data.password2 = !isEmpty(data.password2) ? data.password2 : ""

	//Name checks
	if (Validator.isEmpty(data.name)) {
		errors.name = "Name field is required"
	}

	//Email checks
	if (Validator.isEmpty(data.email)) {
		errors.email = "E-mail field is required";
	} else if (!Validator.isEmail(data.email)) {
		errors.email = "Invalid email"
	}

	//Passwrod checks
	if (Validator.isEmpty(data.password)) {
		errors.password = "Password field is required"
	}

	if (Validator.isEmpty(data.password2)) {
		errors.password2 = "Confirm password field is required"
	}

	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = "Password must be at least 6 characters"
	}

	if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = "Your confirmation password does not match"
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};