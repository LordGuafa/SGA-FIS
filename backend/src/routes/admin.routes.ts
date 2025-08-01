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
adminRouter.get("/personal/:id", checkRole(1), adminController.getPersonalById);
adminRouter.post("/personal", checkRole(1), adminController.createPersonal);
adminRouter.put("/personal/:id", checkRole(1), adminController.updatePersonal);
adminRouter.delete("/personal/:id", checkRole(1), adminController.deletePersonal);

//TODO: Implementar los endpoints de cursos, inscripciones y asignaciones

// Cursos
adminRouter.get("/cursos", checkRole(1), adminController.getCursos);
adminRouter.get("/cursos/:id", checkRole(1), adminController.getCursoById);
adminRouter.post("/cursos", checkRole(1), adminController.createCurso);
adminRouter.put("/cursos/:id", checkRole(1), adminController.updateCurso);
adminRouter.delete("/cursos/:id", checkRole(1), adminController.deleteCurso);

// Inscripciones
adminRouter.get("/inscripciones", checkRole(1), adminController.getInscripcionParticipante);
adminRouter.get("/inscripciones/:id", checkRole(1), adminController.getInscripcionById);
adminRouter.post("/inscripciones", checkRole(1), adminController.createInscripcionParticipante);
adminRouter.put("/inscripciones/:id", checkRole(1), adminController.updateInscripcionParticipante);
adminRouter.delete("/inscripciones/:id", checkRole(1), adminController.deleteInscripcionParticipante);

// Asignaciones
adminRouter.get("/asignaciones", checkRole(1), adminController.getAsignaciones);
adminRouter.get("/asignaciones/:id", checkRole(1), adminController.getAsignacionById);
adminRouter.post("/asignaciones", checkRole(1), adminController.createAsignacion);
adminRouter.put("/asignaciones/:id", checkRole(1), adminController.updateAsignacion);
adminRouter.delete("/asignaciones/:id", checkRole(1), adminController.deleteAsignacion);

export default adminRouter;
