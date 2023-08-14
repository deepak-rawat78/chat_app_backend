import { Socket, Server } from "socket.io";
import SocketModel from "../models/socket.model";

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
		const { sendTo, from } = props;
		const receiverSocket = await SocketModel.findOne({ userId: sendTo });
		if (receiverSocket) {
			this.io.to([receiverSocket.socketId]).emit("message", props);
		} else {
			this.socket.emit("error", new Error("User not found"));
		}
	};
}
