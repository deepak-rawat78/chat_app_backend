import mongoose, { Schema } from "mongoose";

const socketSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	socketId: {
		type: String,
		required: true,
	},
});

const SocketModel = mongoose.model("Socket", socketSchema);
export default SocketModel;
