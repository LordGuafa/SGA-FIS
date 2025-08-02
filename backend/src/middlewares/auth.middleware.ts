import { expressjwt } from "express-jwt";
import { config } from "../config/config";
const jwtSecret = config.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

export const authMiddleware = expressjwt({
    secret: jwtSecret,
    algorithms: ["HS256"],
})