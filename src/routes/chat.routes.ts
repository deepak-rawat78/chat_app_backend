import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getChatMessageList } from "../controllers/chat";
const chatRoutes = Router();

chatRoutes.get("/message/list", authenticate, getChatMessageList);

export default chatRoutes;
