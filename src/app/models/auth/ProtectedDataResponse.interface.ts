export interface IProtectedDataResponse {
    message: string;
    status:number;
    user: {
      id: string;     
      name: string;    
      email: string;   
    };
  } 