export class AvanceAutonomo {
  id: number;
  participante_id: number;
  curso_id: number;
  porcentaje_avance: number;
  fecha_actualizacion: Date;
  observaciones?: string;

  constructor(
    id: number,
    participante_id: number,
    curso_id: number,
    porcentaje_avance: number,
    fecha_actualizacion: Date,
    observaciones?: string
  ) {
    this.id = id;
    this.participante_id = participante_id;
    this.curso_id = curso_id;
    this.porcentaje_avance = porcentaje_avance;
    this.fecha_actualizacion = fecha_actualizacion;
    this.observaciones = observaciones;
  }
}
