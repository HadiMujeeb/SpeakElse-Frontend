export interface IUserLoginCredentials {
    email: string;
    password: string;
}

export interface ILoginSuccessResponse {
    message:string,
    accessToken: string,

}