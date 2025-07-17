import { IUser } from './user';

export interface IUserServices {

    login(username: string, password: string): Promise<IUser>
    updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void>
}