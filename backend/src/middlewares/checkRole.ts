import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            auth?: { role?: string };
        }
    }
}

export function checkRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {

        const user = req.auth as { role?: string };

        if (!user || !user.role || !roles.includes(user.role)) {
            return res.status(403).json({ message: "Acceso denegado"})
        }
        next();
    }
}