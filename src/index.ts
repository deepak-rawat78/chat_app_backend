import { log } from "console";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.routes";
import userRoute from "./routes/user.routes";

const app = express();

app.use(express.json());

const connectMongoose = async () => {
	const url = "mongodb://127.0.0.1:27017/chat_app";
	mongoose.connect(url).then(() => {
		log("mongodb connected at 27017");
	});
};

connectMongoose();

app.use("/chat_app", authRoute);
app.use("/chat_app", userRoute);

app.listen(8000, () => {
	console.log("server started at 8000");
});
