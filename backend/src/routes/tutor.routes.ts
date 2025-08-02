import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/roleCheck.middleware.";
import { TutorController } from "../controllers/tutor.controller";

const tutorRouter = Router();
const tutorController = new TutorController();

tutorRouter.post("/login", tutorController.login);

tutorRouter.use(authMiddleware, checkRole(2));

tutorRouter.put("/change-password/:id", checkRole(2), tutorController.changePassword);

// Asistencias
tutorRouter.post("/asistencias", checkRole(2), tutorController.registrarAsistencia);
tutorRouter.get("/:id/asistencias", checkRole(2), tutorController.getAsistencias);
tutorRouter.put("/asistencias/:id", checkRole(2), tutorController.updateAsistencia);
tutorRouter.delete("/asistencias/:id", checkRole(2), tutorController.deleteAsistencia);

// Notas
tutorRouter.post("/:id/:clase_id/notas", checkRole(2), tutorController.registrarNota);
tutorRouter.get("/:id/:clase_id/notas", checkRole(2), tutorController.getCalificaciones);
tutorRouter.put("/notas/:id", checkRole(2), tutorController.updateNota);
tutorRouter.delete("/notas/:claseId/:participanteId", checkRole(2), tutorController.deleteNota);

// Clases
tutorRouter.post("/clases", checkRole(2), tutorController.createClass);
// tutorRouter.get("/clases/:id", checkRole(2), tutorController.getClassById);
tutorRouter.get("/clases/:id", checkRole(2), tutorController.getClasses);
tutorRouter.put("/clases/:id", checkRole(2), tutorController.updateClass);
tutorRouter.delete("/clases/:id", checkRole(2), tutorController.deleteClass);

// Cursos asignados
tutorRouter.get("/:id/cursos", checkRole(2), tutorController.getCursosAsignados);


tutorRouter.get("/:id/calificaciones", checkRole(2), tutorController.getCalificaciones);

export default tutorRouter;
