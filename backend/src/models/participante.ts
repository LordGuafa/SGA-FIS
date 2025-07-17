export class Participante {
  id_usuario: number;
  departamento_id: number;

  constructor(id_usuario: number, departamento_id: number) {
    this.id_usuario = id_usuario;
    this.departamento_id = departamento_id;
  }
}
