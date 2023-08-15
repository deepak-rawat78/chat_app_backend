import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
	addContactToUser,
	getContactList,
	getUserDetail,
} from "../controllers/user";

const userRoute = Router();

userRoute.get("/userDetail", authenticate, getUserDetail);
userRoute.post("/addContact", authenticate, addContactToUser);
userRoute.get("/getContactList", authenticate, getContactList);

export default userRoute;
