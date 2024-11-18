import { IMember } from './member.model';

export interface IProtectedDataResponse {
  message: string;
  status: number;
  user: IMember;
  accessToken: string;
}
