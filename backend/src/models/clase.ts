export class Clase {
  id: number;
  curso_id: number;
  tutor_id: number;
  fecha: Date;
  tema?: string;

  constructor(id: number, curso_id: number, tutor_id: number, fecha: Date, tema?: string) {
    this.id = id;
    this.curso_id = curso_id;
    this.tutor_id = tutor_id;
    this.fecha = fecha;
    this.tema = tema;
  }
}
