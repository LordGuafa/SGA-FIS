import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/roleCheck.middleware.";
import { AdminController } from "../controllers/admin.controller";

const adminRouter = Router();
const adminController = new AdminController();


adminRouter.post("/login", adminController.login);

// Solo administradores (rol 1) pueden acceder a estas rutas

adminRouter.use(authMiddleware);

//Cambio de contraseña
adminRouter.put(
  "/change-password/:id",
  checkRole(1),
  adminController.changePassword
);
// Participantes
adminRouter.get("/participantes", checkRole(1), adminController.getParticipantes);
adminRouter.get(
  "/participantes/:id",
  checkRole(1),
  adminController.getParticipantesById
);
adminRouter.post(
  "/participantes",
  checkRole(1),
  adminController.createParticipante
);
adminRouter.put(
  "/participantes/:id",
  checkRole(1),
  adminController.updateParticipante
);
adminRouter.delete(
  "/participantes/:id",
  checkRole(1),
  adminController.deleteParticipante
);

// Personal
adminRouter.get("/personal", checkRole(1), adminController.getPersonal);
adminRouter.get("/personal/:id", checkRole(1), adminController.getPersonalBtId);
adminRouter.post("/personal", checkRole(1), adminController.createPersonal);
adminRouter.put("/personal/:id", checkRole(1), adminController.updatePersonal);
adminRouter.delete("/personal/:id", checkRole(1), adminController.deletePersonal);

//TODO: Implementar los endpoints de cursos, inscripciones y asignaciones
export default adminRouter;
