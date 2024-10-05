export interface IUserRegisterationCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string

}

export interface IRegisterSuccessfullResponse {
    message: string;
}

export interface IRegisterErrorResponse {
errorField?: string;
message? : string;
error? : string;
}