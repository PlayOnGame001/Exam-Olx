import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Токен доступа отсутствует" });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Недействительный или просроченный токен" });
            return;
        }

        req.user = decoded as JwtPayload & { userId: string };
        next();
    });
};
