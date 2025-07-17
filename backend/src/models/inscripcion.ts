export class Inscripcion {
  id: number;
  participante_id: number;
  curso_id: number;
  fecha_inscripcion: Date;

  constructor(id: number, participante_id: number, curso_id: number, fecha_inscripcion: Date) {
    this.id = id;
    this.participante_id = participante_id;
    this.curso_id = curso_id;
    this.fecha_inscripcion = fecha_inscripcion;
  }
}
