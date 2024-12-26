import { IMember, IUser } from './member.model';

export interface IProtectedDataResponse {
  message: string;
  status: number;
  user: IUser;
  accessToken: string;
}
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