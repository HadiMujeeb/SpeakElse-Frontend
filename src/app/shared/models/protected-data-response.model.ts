import { IMember } from './member.model';

export interface IProtectedDataResponse {
  message: string;
  status: number;
  user: IMember;
  accessToken: string;
}
export interface IadminauthResponse {
  message: string;
  status: number;
  admin: IMember;
  accessToken: string;
}