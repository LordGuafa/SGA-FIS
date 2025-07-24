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
  async login(email: string, contrasena: string): Promise<string | null> {
    const res = await pool.query(
      "SELECT * FROM personal WHERE correo = $1 and rol_id = 1",
      [email]
    );
    const user: Admin = res.rows[0];
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(contrasena, user.password);
    console.log(isPasswordValid)
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
      "SELECT * FROM personal WHERE id = $1 AND role_id = 1",
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
      "INSERT INTO participante (nombre, correo, password, contacto_1, contacto_2, departamento_id, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        participante.username,
        participante.email,
        hashedPassword,
        participante.contactNumber1,
        participante.contactNumber2,
        participante.departmentId,
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
      "INSERT INTO participante (nombre, correo, password, contacto_1, contacto_2, departamento_id, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
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

  async getParticipantes(): Promise<Participante[]> {
    const res = await pool.query("SELECT * FROM participante");
    return res.rows;
  }

  async getPersonal(): Promise<Tutor[]> {
    const res = await pool.query("SELECT * FROM personal WHERE role_id = 2");
    return res.rows;
  }

  async getParticipanteById(id: number): Promise<Participante | null> {
    const res = await pool.query("SELECT * FROM participante WHERE id = $1", [
      id,
    ]);
    return res.rows[0] || null;
  }

  async getTutorById(id: number): Promise<Tutor | null>{
    const res = await pool.query("SELECT * FROM personal WHERE id = $1 AND role_id = 2", [id]);
    return res.rows[0] || null;
  }

  async deleteParticipante(id: number): Promise<void> {
    const res = await pool.query("DELETE FROM participante WHERE id = $1", [id]);
  }

  async deletePersonal(id: number): Promise<void> {
    const res = await pool.query("DELETE FROM personal WHERE id = $1", [id]);
  }
}

