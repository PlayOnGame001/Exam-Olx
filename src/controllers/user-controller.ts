import "dotenv/config";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redis-config.js";
import { User } from "../models/user-model.js";

export class UserController {
    static async register(req: Request, res: Response):Promise<any> {
        try {
            const { login, email, password, role } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: "Пользователь с такой почтой уже есть" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                id: uuidv4(),
                login,
                email,
                password: hashedPassword,
                role: role || "guest"
            });
            res.status(201).json({ message: "Такой юзер уже есть", user });
        } 
        catch (error) {
            console.error("Ошибка регистрации:", error);
            res.status(500).json({ message: "Ошибка при регистрации пользователя", error });
        }
    }

    static async login(req: Request, res: Response):Promise<any> {
        try {
            const { login, password } = req.body;

            const user = await User.findOne({ where: { login } });
            if (!user) {
                return res.status(401).json({ message: "Ошибка в логине или пароле" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Ошибка в логине или пароле" });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }//token будет жить 1 час 
            );
            res.status(200).json({ message: "Логин прошел успешно", token });
        } 
        catch (error) {
            console.error("Ошибка логина:", error);
            res.status(500).json({ message: "Ошибка логина", error });
        }
    }

    static async updateUser(req: Request, res: Response):Promise<any> {
        try {
            const userId = (req.user as JwtPayload & { userId: string }).userId;
            const { login, email, role } = req.body;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            await user.update({ login, email, role });
            res.status(200).json({ message: "Пользователь успешно обновлен", user });
        } 
        catch (error) {
            res.status(500).json({ message: "Ошибка обновления пользователя", error });
        }
    }

    static async deleteUser(req: Request, res: Response):Promise<any> {
        try {
            const userId = (req.user as JwtPayload & { userId: string }).userId; 
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            await user.destroy();
            res.status(200).json({ message: "Пользователь удален успешно" });
        } 
        catch (error) {
            res.status(500).json({ message: "Ошибка удаления пользователя", error });
        }
    }


    static async getUserProfile(req: Request, res: Response):Promise<any> {
        const userId = (req.user as JwtPayload & { userId: string }).userId;

        try {
            const cachedProfile = await redisClient.get(`user:${userId}`);
            if (cachedProfile) {
                console.log("Обслуживание из кеша");
                return res.status(200).json(JSON.parse(cachedProfile));
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
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
            res.status(500).json({ message: "Ошибка при получении профиля пользователя.", error });
        }
    }
}