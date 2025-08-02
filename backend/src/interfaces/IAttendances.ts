export interface IAttendance {
  tutorId?: number; // Solo requerido en TutorService
  claseId: number;
  participanteId: number;
  presente: boolean;
}