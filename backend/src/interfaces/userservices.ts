export interface IUserServices {

    login(username: string, password: string): Promise<string|null>
    changePassword(id: number, oldPassword: string, newPassword: string): Promise<Boolean>
}