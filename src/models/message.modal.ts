import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
	{
		value: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["sent", "received", "seen"],
			required: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		receiver: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
