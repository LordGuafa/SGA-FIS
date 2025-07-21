import { IUser } from "../../interfaces/user";

export class Tutor implements IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  contactNumber1: string;
  contactNumber2?: string | undefined;
  role: 1 | 2 | 3 = 2;
  constructor(
    id: number,
    username: string,
    email: string,
    password: string,
    contactNumber1: string,
    contactNumber2?: string | undefined
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.contactNumber1 = contactNumber1;
    this.contactNumber2 = contactNumber2;
  }
}
