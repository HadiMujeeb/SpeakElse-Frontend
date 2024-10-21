import { IMember } from "../admin/member.interface";

export interface IProtectedDataResponse {
    message: string;
    status:number;
    user: IMember   
    };
  