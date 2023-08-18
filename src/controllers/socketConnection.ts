import { Socket, Server } from "socket.io";
import SocketModel from "../models/socket.model";
import User from "../models/user.model";
import Message from "../models/message.modal";

export class SocketConnection {
	io: Server;
	socket: Socket;
	constructor(io: Server, socket: Socket) {
		this.io = io;
		this.socket = socket;
	}

	handleUserConnect = async (props: any) => {
		try {
			const { userId } = props;
			const user = await SocketModel.findOne({ userId });
			if (user) {
				await SocketModel.updateOne(
					{ userId },
					{ socketId: this.socket.id }
				);
			} else {
				await new SocketModel({
					userId,
					socketId: this.socket.id,
				}).save();
			}
		} catch (error) {
			this.socket.emit("error", error);
		}
	};

	handleSendMessage = async (props: any) => {
		const { sendTo, message, from } = props;
		const receiver = await User.findOne({ userName: sendTo });

		//TODO: take Id from token
		const sender = await User.findOne({ userName: from });
		if (receiver) {
			let messageObj = new Message({
				value: message,
				status: "sent",
				sender: sender._id,
				receiver: receiver._id,
			});
			await messageObj.save();
			messageObj = await messageObj.populate([
				{ path: "sender", select: "-password -__v -contacts" },
				{ path: "receiver", select: "-password -__v -contacts" },
			]);
			const receiverSocket = await SocketModel.findOne({
				userId: receiver._id,
			});
			if (receiverSocket) {
				this.io
					.to([receiverSocket.socketId])
					.emit("message", messageObj);
			} else {
				this.socket.emit("error", new Error("User not found"));
			}
		} else {
			this.socket.emit("error", new Error("User not found"));
		}
	};
}
