import {IUser} from '../../interfaces/user';
export class Participante implements IUser{
  id: number;
  username: string;
  email: string;
  password: string;
  role: "admin" | "tutor" | "participante";

  constructor(
    id: number,
    username: string,
    email: string,
    password: string,
    role: "admin" | "tutor" | "participante" = "participante",
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}