import { Request, Response } from "express";
import { TutorServices } from "../services/tutor.services";
import { INote } from "../interfaces/INotes";
const tutorServices = new TutorServices();

//TODO:Corregir los cómo se envía la información a los servicios
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
    const response = req.body;
    // const claseId = response.clase_id;
    // const asistencias = response.asistencias;
    const { claseId, asistencias } = req.body;
    await tutorServices.registrarAsistencia(claseId, asistencias);
    res.status(200).json({ message: "Asistencias registradas" });
  }

  async registrarNota(req: Request, res: Response) {
    const nota = req.body;
    const response= req.params;
    const claseId = Number(req.params.clase_id);
    console.log("Notas:", nota);
    await tutorServices.registrarNota(claseId, nota);
    res.status(200).json({ message: "Notas registradas" });
  }

  async getClasesAsignadas(req: Request, res: Response) {
    const tutorId = Number(req.params.id);
    const clases = await tutorServices.getClasesAsignadas(tutorId);
    res.json(clases);
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
    const response = req.body;
    const tutorId = response.tutorId;
    const calificaciones = await tutorServices.getCalificaciones(tutorId);
    if (!calificaciones) {
      return res.status(404).json({ message: "No calificaciones found" });
    }
    res.status(200).json(calificaciones);
  }
}
