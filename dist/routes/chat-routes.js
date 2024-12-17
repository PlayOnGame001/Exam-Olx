import { Router } from "express";
import { MessageController } from "../controllers/chat-controller.js";
import { authenticateToken } from "../middleware/auth-middleware.js";
export const chatRoutes = Router();
chatRoutes.post("/send", authenticateToken, MessageController.sendMessage);
chatRoutes.get("/", authenticateToken, MessageController.getMessages);
chatRoutes.delete("/:messageId", authenticateToken, MessageController.deleteMessage);
