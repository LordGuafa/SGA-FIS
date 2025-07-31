import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from "../middlewares/roleCheck.middleware.";
import { CalificacionController } from '../controllers/calificacion.controller';

const calificacionRouter = Router()
const calificacionController = new CalificacionController()

// Todas las rutas de calificaciones requieren usuario autenticado
calificacionRouter.use(authMiddleware)

// Solo tutores (role 2) pueden crear, actualizar y eliminar calificaciones
calificacionRouter.post('/',          checkRole(2), calificacionController.createCalificacion)
calificacionRouter.put('/:id',        checkRole(2), calificacionController.updateCalificacion)
calificacionRouter.delete('/:id',     checkRole(2), calificacionController.deleteCalificacion)

// Tutores (role 2) y estudiantes (role 3) pueden listar y ver calificaciones
calificacionRouter.get('/',           checkRole(2), calificacionController.getCalificaciones)
calificacionRouter.get('/:id',        checkRole(2), calificacionController.getCalificacion)

export default calificacionRouter