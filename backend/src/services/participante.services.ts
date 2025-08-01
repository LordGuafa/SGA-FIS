import { pool } from "../config/db";
import { Participante } from "../models/personas/participante";
import { IUserServices } from "../interfaces/userservices";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { ICourse } from "../interfaces/ICourses";
import { INote } from "../interfaces/INotes";

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

  async listCursos(id: number): Promise<any[]> {
    const res = await pool.query(
      "SELECT * FROM vista_participante_cursos WHERE participante_id = $1",
      [id]
    );
    return res.rows;
  }

  async getAsistencias(
    participanteId: number,
    cursoId: number
  ): Promise<any[]> {
    // Solo asistencias de cursos sincrónicos
    const res = await pool.query(
      "SELECT * FROM vista_asistencias_participante WHERE participante_id = $1 AND curso_id = $2",
      [participanteId, cursoId]
    );
    return res.rows;
  }

  async getNotas(participanteId: number, cursoId: number): Promise<INote[]> {
    const res = await pool.query(
      `SELECT * FROM vista_notas_participante WHERE participante_id = $1 and curso_id = $2`,
      [participanteId, cursoId]
    );
    return res.rows;
  }
}
