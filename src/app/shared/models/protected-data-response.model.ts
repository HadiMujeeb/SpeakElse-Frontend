import { IMember, IUser } from './member.model';

export interface IProtectedDataResponse {
  message: string;
  status: number;
  user: IUser;
  accessToken: string;
}
  // export interface IUser {
  //   id: string;
  //   email: string;
  //   password: string | null;
  //   name: string;
  //   avatar?: string | null;
  //   profession?: string | null;
  //   language?: string | null;
  //   country?: string | null;
  //   description?: string | null;
  //   isVerified?: boolean;
  //   isBlocked?: boolean;
  //   comments?: IComment[];
  //   userWallet: IuserWallet;

  // }
export interface IadminauthResponse {
  message: string;
  status: number;
  adminData: IMember;
  accessToken: string;
}

export interface ImentorauthResponse {
  message: string;
  status: number;
  mentorData: IMember;
  accessToken: string;
}