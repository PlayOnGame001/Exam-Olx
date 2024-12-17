import { JwtPayload } from "jsonwebtoken";

declare global { //расширение територии
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
