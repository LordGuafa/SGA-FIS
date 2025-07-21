import { IUser } from "../../interfaces/user";

export class Admin implements IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  contactNumber1: string;
  contactNumber2?: string; // Optional contact number
  role: 1 | 2 | 3 = 1;

  constructor(
    id: number,
    username: string,
    email: string,
    password: string,
    contactNumber1: string,
    contactNumber2?: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.contactNumber1 = contactNumber1;
    this.contactNumber2 = contactNumber2;
  }
}
