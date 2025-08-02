import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/roleCheck.middleware.";
import { calificacionController, ParticipanteController } from '../controllers/participante.controller';

const participanteRouter = Router();
const participanteController = new ParticipanteController();

participanteRouter.post('/login', participanteController.login);

participanteRouter.use(authMiddleware, checkRole(3)); 

participanteRouter.put(
    '/change-password/:id', 
    checkRole(3),
    participanteController.changePassword);

participanteRouter.get('/:id/curso/:cursoId/calificaciones', participanteController.getCalificaciones);
participanteRouter.get('/:id/curso/:cursoId/asistencias', participanteController.getAsistencias);
participanteRouter.get('/:id/cursos', participanteController.listCursos);

//TODO implementar los endpoints
// Estudiantes (rol 3) pueden ver sus propias calificaciones


export default participanteRouter;