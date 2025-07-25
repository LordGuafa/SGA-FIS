import { pool } from "../config/db";
import { Admin } from "../models/personas/admin";
import { Participante } from "../models/personas/participante";
import { Tutor } from "../models/personas/tutor";
import { IUserServices } from "../interfaces/userservices";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { config } from "../config/config";

export class AdminServices implements IUserServices {
  async login(email: string, password: string): Promise<string | null> {
    const res = await pool.query(
      "SELECT * FROM personal WHERE email = $1 and rol_id = 1",
      [email]
    );
    const user: Admin = res.rows[0];
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return null;
    }
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
      "SELECT * FROM personal WHERE id = $1 AND rol_id = 1",
      [id]
    );
    const user: Admin = query.rows[0];
    if (!user) {
      return false;
    }
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return false;
    }
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

  async createParticipante(participante: Participante): Promise<Participante> {
    const hashedPassword = await bcrypt.hash(
      participante.password,
      config.SALT_ROUNDS
    );
    const res = await pool.query(
      "INSERT INTO participante (id,nombre, email, password, contact1, contact2, departamento_id, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)",
      [
        participante.id,
        participante.username,
        participante.email,
        hashedPassword,
        participante.contactNumber1,
        participante.contactNumber2,
        participante.departamento_id,
        participante.rol_id,
      ]
    );
    return res.rows[0];
  }

  async createTutor(newTutor: Tutor): Promise<Tutor> {
    const hashedPassword = await bcrypt.hash(
      newTutor.password,
      config.SALT_ROUNDS
    );
    const res = await pool.query(
      "INSERT INTO personal (id,nombre, email, password, contact1, contact2, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        newTutor.id,
        newTutor.username,
        newTutor.email,
        hashedPassword,
        newTutor.contactNumber1,
        newTutor.contactNumber2,
        newTutor.rol_id,
      ]
    );
    return res.rows[0];
  }

  async updateParticipante(
    id: number,
    participante: Partial<Participante>
  ): Promise<Participante | null> {
    const fields = [];
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(participante)) {
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

  async updatePersonal(
    id: number,
    tutor: Partial<Tutor>
  ): Promise<Tutor | null> {
    const fields = [];
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(tutor)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
    values.push(id);
    const res = await pool.query(
      `UPDATE personal SET ${fields.join(
        ", "
      )} WHERE id = $${index} RETURNING *`,
      values
    );
    return res.rows[0] || null;
  }

  async listParticipantes(): Promise<Participante[]> {
    const res = await pool.query("SELECT * FROM participante");
    return res.rows;
  }

  async listTutores(): Promise<Tutor[]> {
    const res = await pool.query("SELECT * FROM personal WHERE rol_id = 2");
    return res.rows;
  }

  async getParticipanteById(id: number): Promise<Participante | null> {
    const res = await pool.query("SELECT * FROM participante WHERE id = $1", [
      id,
    ]);
    return res.rows[0] || null;
  }

  async getTutorById(id: number): Promise<Tutor | null> {
    const res = await pool.query(
      "SELECT * FROM personal WHERE id = $1 AND rol_id = 2",
      [id]
    );
    return res.rows[0] || null;
  }

  async deleteParticipante(id: number): Promise<void> {
    //TODO: Verificar si el participante tiene inscripciones o asistencias antes de eliminar
    const res = await pool.query("DELETE FROM participante WHERE id = $1", [
      id,
    ]);
  }

async deletePersonal(id: number): Promise<void> {
  try {
    await pool.query("DELETE FROM personal WHERE id = $1", [id]);
  } catch (error: any) {
    // Verifica si el error es por restricción de llave foránea (código puede variar según tu motor de BD)
    if (
      error.code === "23503" // Código típico de Postgres para violación de llave foránea
    ) {
      // Reasigna todas las referencias en tutores_cursos al tutor con id 0
      await pool.query(
        "UPDATE clase SET tutor_id = 0 WHERE tutor_id = $1",
        [id]
      );
      // Puedes agregar aquí más actualizaciones si hay otras tablas que referencian a personal.id

      // Intenta eliminar de nuevo
      await pool.query("DELETE FROM personal WHERE id = $1", [id]);
    } else {
      throw error;
    }
  }
}
  async createCurso(curso: any) {
    const result = await pool.query(
      `INSERT INTO cursos (nombre, descripcion) VALUES ($1, $2) RETURNING *`,
      [curso.nombre, curso.descripcion]
    );
    return result.rows[0];
  }

  async updateCurso(id: number, curso: any) {
    await pool.query(
      `UPDATE cursos SET nombre = $1, descripcion = $2 WHERE id = $3`,
      [curso.nombre, curso.descripcion, id]
    );
  }

  async deleteCurso(id: number) {
    await pool.query(`DELETE FROM cursos WHERE id = $1`, [id]);
  }

  async listCursos() {
    const result = await pool.query(`SELECT * FROM cursos`);
    return result.rows;
  }

  async assignTutor(tutor_id: number, curso_id: number) {
    const result = await pool.query(
      `INSERT INTO tutores_cursos (tutor_id, curso_id) VALUES ($1, $2) RETURNING *`,
      [tutor_id, curso_id]
    );
    return result.rows[0];
  }

  async reassignTutor(oldTutorId: number, newTutorId: number, cursoId: number) {
    await pool.query(
      `UPDATE tutores_cursos SET tutor_id = $1 WHERE tutor_id = $2 AND curso_id = $3`,
      [newTutorId, oldTutorId, cursoId]
    );
  }
  // Métodos para inscripciones
  async createInscripcion(participante_id: number, curso_id: number) {
    const result = await pool.query(
      `INSERT INTO inscripciones (participante_id, curso_id) VALUES ($1, $2) RETURNING *`,
      [participante_id, curso_id]
    );
    return result.rows[0];
  }

  async updateInscripcion(
    id: number,
    participante_id: number,
    curso_id: number
  ) {
    await pool.query(
      `UPDATE inscripciones SET participante_id = $1, curso_id = $2 WHERE id = $3`,
      [participante_id, curso_id, id]
    );
  }

  async deleteInscripcion(id: number) {
    await pool.query(`DELETE FROM inscripciones WHERE id = $1`, [id]);
  }

  async listInscripciones() {
    const result = await pool.query(`SELECT * FROM inscripciones`);
    return result.rows;
  }

  // Métodos para notas y asistencias
  async createNota(participante_id: number, curso_id: number, nota: number) {
    const result = await pool.query(
      `INSERT INTO notas (participante_id, curso_id, nota) VALUES ($1, $2, $3) RETURNING *`,
      [participante_id, curso_id, nota]
    );
    return result.rows[0];
  }

  async updateNota(id: number, nota: number) {
    await pool.query(`UPDATE notas SET nota = $1 WHERE id = $2`, [nota, id]);
  }

  async deleteNota(id: number) {
    await pool.query(`DELETE FROM notas WHERE id = $1`, [id]);
  }

  async listNotas() {
    const result = await pool.query(`SELECT * FROM notas`);
    return result.rows;
  }

  async createAsistencia(
    participante_id: number,
    curso_id: number,
    fecha: string,
    estado: string
  ) {
    const result = await pool.query(
      `INSERT INTO asistencias (participante_id, curso_id, fecha, estado) VALUES ($1, $2, $3, $4) RETURNING *`,
      [participante_id, curso_id, fecha, estado]
    );
    return result.rows[0];
  }

  async updateAsistencia(id: number, estado: string) {
    await pool.query(`UPDATE asistencias SET estado = $1 WHERE id = $2`, [
      estado,
      id,
    ]);
  }

  async deleteAsistencia(id: number) {
    await pool.query(`DELETE FROM asistencias WHERE id = $1`, [id]);
  }

  async listAsistencias() {
    const result = await pool.query(`SELECT * FROM asistencias`);
    return result.rows;
  }
}
