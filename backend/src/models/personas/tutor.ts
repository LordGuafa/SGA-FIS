import { IUser } from '../../interfaces/user';

export class Tutor implements IUser {
  id_usuario: number;
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'tutor' | 'participante'= 'tutor';
  constructor(id:number,id_tutor: number,username:string,email:string,password:string) {
    this.id_usuario = id_tutor;
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }

}
