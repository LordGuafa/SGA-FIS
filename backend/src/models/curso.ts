export type Modalidad = 'sincrónica' | 'autónoma';

export class Curso {
  id: number;
  nombre: string;
  descripcion?: string;
  modalidad: Modalidad;

  constructor(id: number, nombre: string, modalidad: Modalidad, descripcion?: string) {
    this.id = id;
    this.nombre = nombre;
    this.modalidad = modalidad;
    this.descripcion = descripcion;
  }
}
