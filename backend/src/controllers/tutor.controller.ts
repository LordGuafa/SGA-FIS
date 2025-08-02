import { Request, Response } from "express";
import { TutorServices } from "../services/tutor.services";
import { INote } from "../interfaces/INotes";
const tutorServices = new TutorServices();

export class TutorController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await tutorServices.login(email, password);
    if (!token) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ token });
  }

  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const userId = Number(req.params.id);
    const success = await tutorServices.changePassword(userId, oldPassword, newPassword);
    if (!success) {
      return res.status(400).json({ message: "Failed to change password" });
    }
    res.status(200).json({ message: "Password changed successfully" });
  }
  async registrarAsistencia(req: Request, res: Response) {

    const asistencia=req.body;
    await tutorServices.registrarAsistencia(asistencia);
    res.status(200).json({ message: "Asistencias registradas" });
  }

  async registrarNota(req: Request, res: Response) {
    const claseId = Number(req.params.clase_id);
    const nota = {
      tutorId: Number(req.params.tutor_id), // si lo estás pasando por URL
      claseId,
      participanteId: req.body.participante_id,
      nota: req.body.nota,
      observaciones: req.body.observacion,
    };

    console.log("Nota normalizada:", nota);
    await tutorServices.registrarNota(nota);
    res.status(200).json({ message: "Notas registradas" });
  }

  async getCursosAsignados(req: Request, res: Response) {
    const tutorId = Number(req.params.id);
    const clases = await tutorServices.getClasesAsignadas(tutorId);
    res.json(clases);
  }

  async createClass(req: Request, res: Response) {
    const clase = req.body;
    const createdClass = await tutorServices.createClass(clase);
    if (!createdClass) {
      return res.status(400).json({ message: "Failed to create class" });
    }
    res.status(201).json(createdClass);
  }

  async getClassById(req: Request, res: Response) {
    const classId = Number(req.params.id);
    const clase = await tutorServices.getClassById(classId);
    if (!clase) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(clase);
  }

  async getClasses(req: Request, res: Response) {
    const tutorId = Number(req.params.id);
    const clases = await tutorServices.getClasesAsignadas(tutorId);
    if (!clases) {
      return res.status(404).json({ message: "No classes found" });
    }
    res.status(200).json(clases);
  }

  async updateClass(req: Request, res: Response) {
    const classId = Number(req.params.id);
    const clase = req.body;
    const updatedClass = await tutorServices.updateClass(classId, clase);
    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(updatedClass);
  }

  async deleteClass(req: Request, res: Response) {
    const classId = Number(req.params.id);
    await tutorServices.deleteClass(classId);
    res.status(204).send();
  }

  async getAsistencias(req: Request, res: Response) {
    const response = req.params;
    const tutorId = Number(response.id);
    console.log("Tutor ID:", tutorId);
    const asistencias = await tutorServices.getAsistencias(tutorId);
    if (!asistencias) {
      return res.status(404).json({ message: "No asistencias found" });
    }
    res.status(200).json(asistencias);
  }

  async getCalificaciones(req: Request, res: Response) {
    const response = req.params;
    const tutorId = Number(response.id);
    console.log("Tutor ID:", tutorId);
    const calificaciones = await tutorServices.getCalificaciones(tutorId);
    if (!calificaciones) {
      return res.status(404).json({ message: "No calificaciones found" });
    }
    res.status(200).json(calificaciones);
  }
  
  async updateAsistencia(req: Request, res: Response) {
    const { claseId, asistencias } = req.body;
    await tutorServices.updateAsistencia(claseId, asistencias);
    res.status(200).json({ message: "Asistencias actualizadas" });
  }

  async updateNota(req: Request, res: Response) {
    const nota  = req.body;
    await tutorServices.registrarNota( nota);
    res.status(200).json({ message: "Nota actualizada" });
  }

  async deleteAsistencia(req: Request, res: Response) {
    const { claseId, participanteId } = req.body;
    await tutorServices.deleteAsistencia(claseId, participanteId);
    res.status(204).send();
  }

  async deleteNota(req: Request, res: Response) {
    const { claseId, participanteId } = req.body;
    await tutorServices.deleteNota(claseId, participanteId);
    res.status(204).send();
  }
  
}
