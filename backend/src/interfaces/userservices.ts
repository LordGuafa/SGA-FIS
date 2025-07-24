export interface IUserServices {

    login(username: string, password: string): Promise<string|null>
    changePassword(id: number, oldPassword: string, newPassword: string): Promise<Boolean>

    // Métodos para tutor
    createClase?(tutorId: number, cursoId: number, fecha: Date, tema?: string): Promise<any>
    registrarAsistencia?(claseId: number, asistencias: { participanteId: number, presente: boolean }[]): Promise<void>
    registrarNota?(claseId: number, notas: { participanteId: number, nota: number, observaciones?: string }[]): Promise<void>

    // Métodos para participante
    getAsistencias?(participanteId: number): Promise<any[]>
    getNotas?(participanteId: number): Promise<any[]>
}