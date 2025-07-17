export class Calificacion {
  id: number;
  participante_id: number;
  curso_id: number;
  nota: number;
  fecha_registro: Date;

  constructor(id: number, participante_id: number, curso_id: number, nota: number, fecha_registro: Date) {
    this.id = id;
    this.participante_id = participante_id;
    this.curso_id = curso_id;
    this.nota = nota;
    this.fecha_registro = fecha_registro;
  }
}
