export class TutorCurso {
  id: number;
  tutor_id: number;
  curso_id: number;

  constructor(id: number, tutor_id: number, curso_id: number) {
    this.id = id;
    this.tutor_id = tutor_id;
    this.curso_id = curso_id;
  }
}
