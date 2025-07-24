import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            auth?: { rol_id?: number };
        }
    }
}

export function checkRole(...roles: number[]) {
    return (req: Request, res: Response, next: NextFunction) => {

        const user = req.auth as { rol_id?: number };

        if (!user || !user.rol_id || !roles.includes(user.rol_id)) {
            return res.status(403).json({ message: "Acceso denegado"})
        }
        next();
    }
}