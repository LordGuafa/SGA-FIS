import { expressjwt } from "express-jwt";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

export const authMiddleware = expressjwt({
    secret: jwtSecret,
    algorithms: ["HS256"],
})