import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
	{
		contact: { type: Schema.Types.ObjectId, ref: "User", required: true },
		contactType: {
			type: String,
			enum: ["individual", "group"],
			required: true,
		},
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
