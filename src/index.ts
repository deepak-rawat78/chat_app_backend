import { log } from "console";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.routes";
import userRoute from "./routes/user.routes";
import * as http from "http";
import "dotenv/config";
import { Server, Socket } from "socket.io";
import { SocketConnection } from "./controllers/socketConnection";
import chatRouter from "./routes/chat.routes";

var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let server: http.Server;

const url = process.env.MONGODB_URL as string;

mongoose.connect(url).then(() => {
	log("Connected to mongodb");
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			log("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: Error) => {
	log(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	log("SIGTERM received");
	if (server) {
		server.close();
	}
});

app.use("/chat_app", authRoute);
app.use("/chat_app", userRoute);
app.use("/chat_app", chatRouter);

server = app.listen(8000, () => {
	console.log("Server started at 8000");
});

let io: Server = new Server(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket: Socket) => {
	const socketService = new SocketConnection(io, socket);
	socket.on("ready", socketService.handleUserConnect);
	socket.on("sendMessage", socketService.handleSendMessage);
});
