import { log } from "console";

const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

const connectMongoose = async () => {
	const url = "mongodb://127.0.0.1:27017/chat_app";
	const client = new MongoClient(url);
	client.connect().then(() => {
		log("mongodb connected at 27017");
	});
};

connectMongoose();

app.get("/chat_app", (req: any, res: any) => {
	console.log(req, res);
	res.json({ message: "Good job" });
});

app.listen(8000, () => {
	console.log("server started at 8000");
});
