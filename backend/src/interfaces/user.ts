export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  contactNumber1: string;
  contactNumber2?: string; // Optional contact number    role: 1|2|3;
}
