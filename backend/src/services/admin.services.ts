import { db } from "../config/db";
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
    const res = await db.query(
      "SELECT * FROM personal WHERE correo = $1 and role_id = 1",
      [email]
    );
    const user: Admin = res.rows[0];
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
        role: user.role,
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
    const query = await db.query(
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
    const hashedNewPassword = await bcrypt.hash(newPassword, config.SALT_ROUNDS);
    await db.query("UPDATE personal SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      id,
    ]);
    return true;
    }
    
    async createParticipante(participante:Participante): Promise<Participante>{
        const hashedPassword = await bcrypt.hash(participante.password, config.SALT_ROUNDS);
        const res = await db.query(
            "INSERT INTO participante (nombre, correo, password, contacto_1, contacto_2, departamento_id, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [
                participante.username,
                participante.email,
                hashedPassword,
                participante.contactNumber1,
                participante.contactNumber2,
                participante.departmentId,
                participante.role
            ]
        );
        return res.rows[0];
    }
    async createTutor(newTutor:Tutor): Promise<Tutor>{
        const hashedPassword = await bcrypt.hash(newTutor.password, config.SALT_ROUNDS);
        const res = await db.query(
            "INSERT INTO participante (nombre, correo, password, contacto_1, contacto_2, departamento_id, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [
                newTutor.username,
                newTutor.email,
                hashedPassword,
                newTutor.contactNumber1,
                newTutor.contactNumber2,
                newTutor.role
            ]
        );
        return res.rows[0];
    }
}
