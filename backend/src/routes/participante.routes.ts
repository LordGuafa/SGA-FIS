import { Router } from 'express';
import { checkRole } from '../middlewares/roleCheck.middleware.';
import { calificacionController } from '../controllers/participante.controller';

const participanteRouter = Router();

// Estudiantes (rol 3) pueden ver sus propias calificaciones

participanteRouter.get(
  '/mis-calificaciones/:id',
  checkRole(3),
  calificacionController.getCalificacion 
);

export default participanteRouter;