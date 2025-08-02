import { Request, Response } from "express";
import { ParticipanteServices } from "../services/participante.services";

const service = new ParticipanteServices();
export class ParticipanteController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await service.login(email, password);
    if (token) {
      return res.status(200).json({ token });
    }
    res.status(401).json({ message: "Invalid email or password" });
  }
  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const userId = Number(req.params.id);
    const success = await service.changePassword(
      userId,
      oldPassword,
      newPassword
    );
    if (success) {
      return res.status(200).json({ message: "Password changed successfully" });
    }
    res.status(400).json({ message: "Failed to change password" });
  }
  async getNotas(req: Request, res: Response) {
    const participanteId = parseInt(req.params.par_id);
    const cursoId = parseInt(req.params.curso_id);
    const calificaciones = await service.getNotas(participanteId, cursoId);
    res.status(200).json(calificaciones);
  }
  async listCursos(req: Request, res: Response) {
    const participanteId = parseInt(req.params.id);
    const cursos = await service.listCursos(participanteId);
    res.status(200).json(cursos);
  }
  async getAsistencias(req: Request, res: Response) {
    const participanteId = parseInt(req.params.id);
    const cursoId = parseInt(req.params.cursoId);
    console.log(participanteId, cursoId)
    const asistencias = await service.getAsistencias(participanteId, cursoId);
    res.status(200).json(asistencias);
  }
}

export const calificacionController = new ParticipanteController();
