import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redis-config.js";
import { User } from "../models/user-model.js";
export class UserController {
    static async register(req, res) {
        try {
            const { login, email, password, role } = req.body;
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: "User with this email already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                id: uuidv4(),
                login,
                email,
                password: hashedPassword,
                role: role || "guest"
            });
            res.status(201).json({ message: "User registered successfully", user });
        }
        catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Error registering user", error });
        }
    }
    static async login(req, res) {
        try {
            const { login, password } = req.body;
            const user = await User.findOne({ where: { login } });
            if (!user) {
                return res.status(401).json({ message: "Invalid login or password" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid login or password" });
            }
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ message: "Logged in successfully", token });
        }
        catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Error logging in", error });
        }
    }
    static async updateUser(req, res) {
        try {
            const userId = req.user.userId;
            const { login, email, role } = req.body;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await user.update({ login, email, role });
            res.status(200).json({ message: "User updated successfully", user });
        }
        catch (error) {
            console.error("Update error:", error);
            res.status(500).json({ message: "Error updating user", error });
        }
    }
    static async deleteUser(req, res) {
        try {
            const userId = req.user.userId; // Уточняем тип
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await user.destroy();
            res.status(200).json({ message: "User deleted successfully" });
        }
        catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({ message: "Error deleting user", error });
        }
    }
    static async getUserProfile(req, res) {
        const userId = req.user.userId;
        try {
            const cachedProfile = await redisClient.get(`user:${userId}`);
            if (cachedProfile) {
                console.log("Serving from cache");
                return res.status(200).json(JSON.parse(cachedProfile));
            }
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const profileData = {
                id: user.id,
                login: user.login,
                email: user.email,
                role: user.role,
            };
            await redisClient.set(`user:${userId}`, JSON.stringify(profileData), { EX: 3600 });
            res.status(200).json(profileData);
        }
        catch (error) {
            console.error("Error fetching user profile:", error);
            res.status(500).json({ message: "Error fetching user profile", error });
        }
    }
}
