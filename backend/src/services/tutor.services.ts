import { pool } from "../config/db";
import { Tutor } from "../models/personas/tutor";
import { IUserServices } from "../interfaces/userservices";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export class TutorServices implements IUserServices {
  async login(email: string, password: string): Promise<string | null> {
    const res = await pool.query(
      "SELECT * FROM personal WHERE email = $1 and rol_id = 2",
      [email]
    );
    const user: Tutor = res.rows[0];
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    const token = jwt.sign(
      {
        id: user.id,
        name: user.username,
        contact1: user.contactNumber1,
        contact2: user.contactNumber2,
        email: user.email,
        rol_id: user.rol_id,
      },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  }

  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<Boolean> {
    const query = await pool.query("SELECT * FROM personal WHERE id = $1 AND rol_id = 2", [id]);
    const user: Tutor = query.rows[0];
    if (!user) return false;
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) return false;
    const hashedNewPassword = await bcrypt.hash(newPassword, config.SALT_ROUNDS);
    await pool.query("UPDATE personal SET password = $1 WHERE id = $2", [hashedNewPassword, id]);
    return true;
  }

  async registrarAsistencia(claseId: number, asistencias: { participanteId: number, presente: boolean }[]): Promise<void> {
    for (const asistencia of asistencias) {
      await pool.query(
        "INSERT INTO asistencia (clase_id, participante_id, presente) VALUES ($1, $2, $3) ON CONFLICT (clase_id, participante_id) DO UPDATE SET presente = $3",
        [claseId, asistencia.participanteId, asistencia.presente]
      );
    }
  }

  async registrarNota(claseId: number, notas: { participanteId: number, nota: number, observaciones?: string }[]): Promise<void> {
    for (const nota of notas) {
      await pool.query(
        "INSERT INTO calificacion (clase_id, participante_id, nota, observaciones) VALUES ($1, $2, $3, $4) ON CONFLICT (clase_id, participante_id) DO UPDATE SET nota = $3, observaciones = $4",
        [claseId, nota.participanteId, nota.nota, nota.observaciones || null]
      );
    }
  }

  async getClasesAsignadas(tutorId: number) {
    const res = await pool.query(
      "SELECT * FROM vista_tutor_clases WHERE tutor_id = $1",
      [tutorId]
    );
    return res.rows;
  }

  async getAsistencias(tutorId: number) {
    const res = await pool.query(
      "SELECT * FROM vista_tutor_asistencias WHERE tutor_id = $1",
      [tutorId]
    );
    return res.rows;
  }

  async getCalificaciones(tutorId: number) {
    const res = await pool.query(
      "SELECT * FROM vista_tutor_calificaciones WHERE tutor_id = $1",
      [tutorId]
    );
    return res.rows;
  }
}
