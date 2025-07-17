import { IUser } from '../../interfaces/user'

export class Admin implements IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'tutor' | 'participante' = 'admin';

  constructor(id: number, username: string, email: string, password: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}