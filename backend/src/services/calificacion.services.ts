import { pool } from '../config/db'
import { Calificacion } from '../models/calificacion'

export class CalificacionServices {
  async getAllCalificaciones(): Promise<Calificacion[]> {
    const res = await pool.query<Calificacion>(`
      SELECT
        id,
        participante_id AS "participanteId",
        curso_id        AS "cursoId",
        nota,
        fecha_registro  AS "fechaRegistro"
      FROM calificacion
      ORDER BY fecha_registro DESC
    `)
    return res.rows
  }

  async getCalificacionById(id: number): Promise<Calificacion> {
    const res = await pool.query<Calificacion>(`
      SELECT
        id,
        participante_id AS "participanteId",
        curso_id        AS "cursoId",
        nota,
        fecha_registro  AS "fechaRegistro"
      FROM calificacion
      WHERE id = $1
    `, [id])

    if (!res.rows[0]) {
      throw new Error('Calificación no encontrada')
    }
    return res.rows[0]
  }

  async createCalificacion(
    data: Omit<Calificacion, 'id' | 'fechaRegistro'>
  ): Promise<Calificacion> {
    const { participante_id, curso_id, nota } = data
    const res = await pool.query<Calificacion>(`
      INSERT INTO calificacion (
        participante_id,
        curso_id,
        nota
      ) VALUES($1, $2, $3, $4)
      RETURNING
        id,
        participante_id AS "participanteId",
        curso_id        AS "cursoId",
        nota,
        fecha_registro  AS "fechaRegistro"
    `, [participante_id, curso_id, nota])

    return res.rows[0]
  }

  async updateCalificacion(
    id: number,
    cambios: Partial<Omit<Calificacion, 'id' | 'fechaRegistro'>>
  ): Promise<Calificacion> {
    const sets: string[] = []
    const vals: any[] = []
    let idx = 1

    if (cambios.participante_id !== undefined) {
      sets.push(`participante_id = $${idx++}`)
      vals.push(cambios.participante_id)
    }

    if (cambios.curso_id !== undefined) {
      sets.push(`curso_id = $${idx++}`)
      vals.push(cambios.curso_id)
    }

    if (cambios.nota !== undefined) {
      sets.push(`valor = $${idx++}`)
      vals.push(cambios.nota)
    }

    if (sets.length === 0) {
      return this.getCalificacionById(id)
    }

    vals.push(id)
    const query = `
      UPDATE calificacion
        SET ${sets.join(', ')}, fecha_registro = NOW()
      WHERE id = $${idx}
      RETURNING
        id,
        participante_id AS "participanteId",
        curso_id        AS "cursoId",
        nota,
        fecha_registro  AS "fechaRegistro"
    `
    const res = await pool.query<Calificacion>(query, vals)
    return res.rows[0]
  }

  async deleteCalificacion(id: number): Promise<void> {
    await pool.query('DELETE FROM calificacion WHERE id = $1', [id])
  }
}