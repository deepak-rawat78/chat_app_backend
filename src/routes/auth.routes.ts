import { Router } from "express";
import {
	getAccessToken,
	loginController,
	signUpController,
} from "../controllers/auth";

const authRoute = Router();

authRoute.post("/signUp", signUpController);
authRoute.post("/login", loginController);
authRoute.post("/refreshToken", getAccessToken);

export default authRoute;
