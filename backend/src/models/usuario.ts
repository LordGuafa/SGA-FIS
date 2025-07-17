export type Rol = 'administrativo' | 'tutor' | 'participante';

export class Usuario {
  id: number;
  nombre_completo: string;
  email: string;
  contraseña: string;
  rol: Rol;

  constructor(id: number, nombre_completo: string, email: string, contraseña: string, rol: Rol) {
    this.id = id;
    this.nombre_completo = nombre_completo;
    this.email = email;
    this.contraseña = contraseña;
    this.rol = rol;
  }
}
