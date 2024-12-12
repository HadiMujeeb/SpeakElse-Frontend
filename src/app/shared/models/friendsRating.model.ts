import { IUser } from "./member.model";

export  interface IReponseRatings {
  feedback: string;
  rating: number;
  givenBy:{
    id:string
    name:string,
    avatar:string
  }
  createdAt: Date;
}

  
export interface IComment {
    userId: string;
    feedback: string;
    rating: number;
    givenBy: string;
    giverName?: string;
  }


  export interface IReport {
    id: string;
    reporterId: string;
    reportedId: string;
    content: string | null;
    proof?: string;
    status: string;
  }
  
export interface IResponseReport extends IReport {
  reporter: IUser;
  reported: IUser;
}

export interface ITransaction {
  id?: string;
  userId: string;     
  fundReceiverId: string;    
  amount: number;         
  type: string;           
  status:IStatus; 
  transactionId: string | null;
  paymentMethod: string;   
  sessionId: string;    
  description: string;   
  createdAt?: Date
  updatedAt?: Date   
}

export enum IStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS"

}