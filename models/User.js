/* Within User.js we will
*	Pull in our required dependencies
*	Create a Schema to represent a User, defining fields and types of objects of the schema
*	Export the model so we can access it outside of this file
*/

const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = User = mongoose.model("users", UserSchema)