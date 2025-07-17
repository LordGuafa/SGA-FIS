export class Asistencia {
  id: number;
  clase_id: number;
  participante_id: number;
  presente: boolean;

  constructor(id: number, clase_id: number, participante_id: number, presente: boolean) {
    this.id = id;
    this.clase_id = clase_id;
    this.participante_id = participante_id;
    this.presente = presente;
  }
}
