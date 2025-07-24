import { pool } from "../config/db";
import { Participante } from "../models/personas/participante";
import { IUserServices } from "../interfaces/userservices";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export class ParticipanteServices implements IUserServices {
  async login(email: string, password: string): Promise<string | null> {
    const res = await pool.query(
      "SELECT * FROM participante WHERE email = $1 and rol_id = 3",
      [email]
    );
    const user: Participante = res.rows[0];
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

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<Boolean> {
    const query = await pool.query(
      "SELECT * FROM participante WHERE id = $1 AND rol_id = 3",
      [id]
    );
    const user: Participante = query.rows[0];
    if (!user) return false;
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) return false;
    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      config.SALT_ROUNDS
    );
    await pool.query("UPDATE participante SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      id,
    ]);
    return true;
  }

  async getAsistencias(participanteId: number): Promise<any[]> {
    // Solo asistencias de cursos sincrónicos
    const res = await pool.query(
      `SELECT a.*, cl.curso_id, cl.fecha, cl.tema
       FROM asistencia a
       JOIN clase cl ON cl.id = a.clase_id
       JOIN inscripcion i ON i.participante_id = a.participante_id AND i.curso_id = cl.curso_id
       JOIN catalogo_modalidad cm ON cm.id = i.modalidad_id
       WHERE a.participante_id = $1 AND cm.nombre = 'sincronica'`,
      [participanteId]
    );
    return res.rows;
  }

  async getNotas(participanteId: number): Promise<any[]> {
    const res = await pool.query(
      `SELECT cal.*, cl.curso_id, cl.fecha, cl.tema
       FROM calificacion cal
       JOIN clase cl ON cl.id = cal.clase_id
       WHERE cal.participante_id = $1`,
      [participanteId]
    );
    return res.rows;
  }
}
