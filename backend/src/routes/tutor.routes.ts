import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/roleCheck.middleware.";
import { TutorController } from "../controllers/tutor.controller";

const tutorRouter = Router();
const tutorController = new TutorController();

tutorRouter.post("/login", tutorController.login);

tutorRouter.use(authMiddleware, checkRole(2));

tutorRouter.put(
  "/change-password/:id",
  checkRole(2),
  tutorController.changePassword
);

tutorRouter.post(
  "/asistencias",
  checkRole(2),
  tutorController.registrarAsistencia
);
tutorRouter.post("/:id/:clase_id/notas", checkRole(2), tutorController.registrarNota);

tutorRouter.get("/:id/clases", checkRole(2), tutorController.getClasesAsignadas);

tutorRouter.get("/:id/asistencias", checkRole(2), tutorController.getAsistencias);

tutorRouter.get(
  "/:id/calificaciones",
  checkRole(2),
  tutorController.getCalificaciones
);

export default tutorRouter;
