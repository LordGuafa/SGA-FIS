import { pool } from "../config/db";
import { Tutor } from "../models/personas/tutor";
import { IUserServices } from "../interfaces/userservices";
import { INote } from "../interfaces/INotes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { IAttendance } from "../interfaces/IAttendances";
import { IClass } from "../interfaces/IClass";

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

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<Boolean> {
    const query = await pool.query(
      "SELECT * FROM personal WHERE id = $1 AND rol_id = 2",
      [id]
    );
    const user: Tutor = query.rows[0];
    if (!user) return false;
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) return false;
    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      config.SALT_ROUNDS
    );
    await pool.query("UPDATE personal SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      id,
    ]);
    return true;
  }

  async registrarAsistencia(data: IAttendance) {
    const query = `
      INSERT INTO asistencia (clase_id, participante_id, presente)
      SELECT $2, $3, $4
      FROM clase c
      JOIN asignacion_tutor_curso atc ON atc.curso_id = c.curso_id
      JOIN inscripcion i ON i.curso_id = c.curso_id AND i.participante_id = $3
      WHERE c.id = $2
        AND atc.tutor_id = $1
        AND es_sincronico($3, c.curso_id) = true
      ON CONFLICT (clase_id, participante_id)
      DO UPDATE SET presente = EXCLUDED.presente
    `;
    await pool.query(query, [
      data.tutorId,
      data.claseId,
      data.participanteId,
      data.presente,
    ]);
  }

  async registrarNota(data: INote) {
    const query = `
      INSERT INTO calificacion (clase_id, participante_id, nota, observaciones)
      SELECT $2, $3, $4, $5
      FROM clase c
      JOIN asignacion_tutor_curso atc ON atc.curso_id = c.curso_id
      JOIN inscripcion i ON i.curso_id = c.curso_id AND i.participante_id = $3
      WHERE c.id = $2 AND atc.tutor_id = $1
      ON CONFLICT (clase_id, participante_id)
      DO UPDATE SET nota = EXCLUDED.nota, observaciones = EXCLUDED.observaciones
    `;
    await pool.query(query, [
      data.tutorId,
      data.claseId,
      data.participanteId,
      data.nota,
      data.observaciones,
    ]);
  }

  async getClasesAsignadas(tutorId: number) {
    const res = await pool.query(
      "SELECT * FROM vista_tutor_cursos WHERE tutor_id = $1",
      [tutorId]
    );
    return res.rows;
  }
  async creteClass(clase: IClass) {
    const res = await pool.query(
      "INSERT INTO clase (curso_id, tutor_id, fecha, tema) VALUES($1, $2, $3,$4) RETURNING *",
      [clase.curso_id, clase.tutor_id, clase.fecha, clase.tema]
    );
    return res.rows[0];
  }
  async updateClass(id: number, clase: Partial<IClass>) {
     const fields = [];
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(clase)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
    values.push(id);
    const res = await pool.query(
      `UPDATE participante SET ${fields.join(
        ", "
      )} WHERE id = $${index} RETURNING *`,
      values
    );
    return res.rows[0] || null;
  }

  async getAsistencias(tutorId: number) {
    const res = await pool.query(
      "SELECT * FROM vista_asistencias_tutor WHERE tutor_id = $1",
      [tutorId]
    );
    return res.rows;
  }

  async getCalificaciones(tutorId: number) {
    const res = await pool.query(
      "SELECT * FROM vista_notas_tutor WHERE tutor_id = $1",
      [tutorId]
    );
    return res.rows;
  }

  async updateAsistencia(id: number, estado: string): Promise<void> {
    await pool.query(`UPDATE asistencias SET estado = $1 WHERE id = $2`, [
      estado,
      id,
    ]);
  }

  async deleteAsistencia(
    claseId: number,
    participanteId: number
  ): Promise<void> {
    await pool.query(
      "DELETE FROM asistencia WHERE clase_id = $1 AND participante_id = $2",
      [claseId, participanteId]
    );
  }

  async updateNota(id: number, nota: Partial<INote>): Promise<INote | null> {
    const fields = [];
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(nota)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
    values.push(id);
    const res = await pool.query(
      `UPDATE curso SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
      values
    );
    return res.rows[0] || null;
  }

  async deleteNota(claseId: number, participanteId: number): Promise<void> {
    await pool.query(
      "DELETE FROM calificacion WHERE clase_id = $1 AND participante_id = $2",
      [claseId, participanteId]
    );
  }
}
