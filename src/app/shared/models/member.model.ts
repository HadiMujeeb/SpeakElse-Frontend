import { IComment, ITransaction } from "./friendsRating.model";

export interface IMembersListResponse {
    members: IMember[];
    message: string;
  }
  
  export interface IMember {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    profession: string;
    country: string;
    language: string;
    isBlocked: boolean;
    createdAt: string;
    
}

  export interface IUser {
    id: string;
    email: string;
    password: string | null;
    name: string;
    avatar?: string | null;
    profession?: string | null;
    language?: string | null;
    country?: string | null;
    description?: string | null;
    isVerified?: boolean;
    isBlocked?: boolean;
    comments?: IComment[];
    userWallet: IuserWallet;

  }
  export interface IuserWallet {
    id: string;
    userId: string;
    balance: number;
    transactions?: ITransaction[];
  }