import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getUserDetail } from "../controllers/user";

const userRoute = Router();

userRoute.get("/userDetail", authenticate, getUserDetail);

export default userRoute;
