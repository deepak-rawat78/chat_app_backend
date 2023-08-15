import mongoose, { Schema } from "mongoose";

const userScheme = new Schema({
	userName: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	contacts: {
		type: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
	},
});

const User = mongoose.model("User", userScheme);

export default User;
