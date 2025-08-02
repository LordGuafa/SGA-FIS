import { IUser } from "../../interfaces/IUser";
export class Participante implements IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  contactNumber1: string;
  contactNumber2?: string;
  departamento_id: number;
  rol_id: 1 | 2 | 3 = 3;

  constructor(
    id: number,
    username: string,
    email: string,
    password: string,
    department: number,
    contactNumber1: string,
    contactNumber2?: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.contactNumber1 = contactNumber1;
    this.contactNumber2 = contactNumber2;
    this.departamento_id = department;
  }
}
