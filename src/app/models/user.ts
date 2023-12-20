export interface UserModel {
    username: string,
    firstname: string,
    lastname: string,
    email: string
}

export const EmptyTab: UserModel = {
    username: '',
    firstname: '',
    lastname: '',
    email: ''
}
