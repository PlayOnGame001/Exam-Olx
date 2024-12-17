import { Router } from "express";
import { UserController } from "../controllers/user-controller.js";
import { authenticateToken } from "../middleware/auth-middleware.js";

export const userRoutes = Router();

userRoutes.post("/register", UserController.register);
userRoutes.post("/login", UserController.login);

userRoutes.put("/update", authenticateToken, UserController.updateUser);
userRoutes.delete("/delete", authenticateToken, UserController.deleteUser);
userRoutes.get("/profile", authenticateToken, UserController.getUserProfile);
