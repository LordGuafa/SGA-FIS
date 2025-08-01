import { Request, Response } from "express";
import { AdminServices } from "../services/admin.services";

//TODO: Verificar la gestión de notas, asistencias e inscripciones
export class AdminController {
  private services = new AdminServices();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.services.login(email, password);
    if (!token) return res.status(401).json({ message: 'Invalid credentials' });
    res.status(200).json({ token });
  }
  changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const userId = Number(req.params.id);
    const success = await this.services.changePassword(userId, oldPassword, newPassword);
    if (!success) return res.status(400).json({ message: 'Failed to change password' });
    res.status(200).json({ message: 'Password changed successfully' });
  };
  getParticipantes = async (_: Request, res: Response) => {
    const participantes = await this.services.listParticipantes();
    res.status(200).json(participantes);
  };

  getParticipantesById = async (req: Request, res: Response) => {
    const participante = await this.services.getParticipanteById(
      Number(req.params.id)
    );
    if (participante) return res.status(200).json(participante);
    return res.status(404).json({ message: "Participante not found" });
  };

  getPersonal = async (_: Request, res: Response) => {
    const personal = await this.services.listTutores();
    res.status(200).json(personal);
  };

  getPersonalById = async (req: Request, res: Response) => {
    const tutor = await this.services.getTutorById(Number(req.params.id));
    if (tutor) return res.status(200).json(tutor);
    return res.status(404).json({ message: "Tutor not found" });
  };

  createParticipante = async (req: Request, res: Response) => {
    const newParticipante = await this.services.createParticipante(req.body);
    res.status(201).json(newParticipante);
  };

  createPersonal = async (req: Request, res: Response) => {
    const newPersonal = await this.services.createTutor(req.body);
    res.status(201).json(newPersonal);
  };

  updateParticipante = async (req: Request, res: Response) => {
    const updated = await this.services.updateParticipante(
      Number(req.params.id),
      req.body
    );
    if (updated) return res.json(updated);
    res.status(404).json({ message: "Participante not found" });
  };

  updatePersonal = async (req: Request, res: Response) => {
    const updated = await this.services.updatePersonal(
      Number(req.params.id),
      req.body
    );
    if (updated) return res.json(updated);
    res.status(404).json({ message: "Participante not found" });
  };

  deleteParticipante = async (req: Request, res: Response) => {
    await this.services.deleteParticipante(Number(req.params.id));
    res.status(204).send();
  };

  deletePersonal = async (req: Request, res: Response) => {
    await this.services.deletePersonal(Number(req.params.id));
    res.status(204).send();
  };

  getCursos = async (req: Request, res: Response) => {
    const cursos = await this.services.listCursos();
    res.status(200).json(cursos);
  }

  createCurso = async (req: Request, res: Response) => {
    const newCurso = await this.services.createCurso(req.body);
    res.status(201).json(newCurso);
  }

  createInscripcionParticipante = async (req: Request, res: Response) => {
    const response = req.body;
    const newInscripcion = await this.services.createInscripcionParticipante(response);
    res.status(201).json(newInscripcion);
  }

  getInscripcionParticipante = async (req: Request, res: Response) => {
    const inscripcion = await this.services.listInscripcionesParticipantes();  
    if (inscripcion) return res.status(200).json(inscripcion);
    res.status(404).json({ message: "Inscripcion not found" });
  }

  updateCurso = async (req: Request, res: Response) => {
    const updatedCurso = await this.services.updateCurso(
      Number(req.params.id),
      req.body
    );
    if (updatedCurso) return res.json(updatedCurso);
    res.status(404).json({ message: "Curso not found" });
  }

  updateInscripcionParticipante = async (req: Request, res: Response) => {
    const updates = req.body;
    const id = Number(req.params.id);
    const updatedInscripcion = await this.services.updateInscripcionParticipante(id, updates);
    if (updatedInscripcion) return res.status(201).json(updatedInscripcion);
    res.status(401).json({ message: "Something went wrong :(" });
  }

  deleteCurso = async (req: Request, res: Response) => {
    await this.services.deleteCurso(Number(req.params.id));
    res.status(204).send();
  }

  deleteInscripcionParticipante = async (req: Request, res: Response) => {
    await this.services.deleteInscripcionParticipante(Number(req.params.id));
    res.status(204).send();
  }

  createAsignacion = async (req: Request, res: Response) => {
    const response = req.body;
    const newAsignacion = await this.services.createAsignarTutor(response);
    res.status(201).json(newAsignacion);
  }

  getAsignaciones = async (req: Request, res: Response) => {
    const asignaciones = await this.services.listAsignaciones();
    res.status(200).json(asignaciones);
  }

  updateAsignacion = async (req: Request, res: Response) => {
    const updates = req.body;
    const id = Number(req.params.id);
    const updatedAsignacion = await this.services.updateAsignarTutor(id, updates);
    if (updatedAsignacion) return res.status(201).json(updatedAsignacion);
    res.status(401).json({ message: "Something went wrong :(" });
  }

  deleteAsignacion = async (req: Request, res: Response) => {
    await this.services.deleteAsignarTutor(Number(req.params.id));
    res.status(204).send();
  }

  
//TODO: llamar los sercivios de inscripciones y asignaciones  

}
