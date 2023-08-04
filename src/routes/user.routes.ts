import { Router } from "express";
import { authenticate } from "../controllers/auth";
import { getUserDetail } from "../controllers/user";

const userRoute = Router();

userRoute.get("/userDetail", authenticate, getUserDetail);

export default userRoute;
