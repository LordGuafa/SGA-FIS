export interface INote {
  tutorId?: number; // Solo requerido en TutorService
  claseId: number;
  participanteId: number;
  nota: number;
  observaciones?: string;
}