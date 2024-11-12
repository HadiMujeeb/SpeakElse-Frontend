import { IMember } from './member.interface';

export interface IProtectedDataResponse {
  message: string;
  status: number;
  user: IMember;
  accessToken: string;
}
