import { Router } from 'express';
import { checkRole } from '../middlewares/roleCheck.middleware.';
import { calificacionController } from '../controllers/participante.controller';

const participanteRouter = Router();

//TODO implementar los endpoints
// Estudiantes (rol 3) pueden ver sus propias calificaciones


export default participanteRouter;