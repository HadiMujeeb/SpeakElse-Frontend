export interface IMembersListResponse {
    members: IMember[];
    message: string;
  }
  
  export interface IMember {
    id: string;
    name: string;
    email: string;
    role: string;
    profession: string;
    isBlocked: boolean;
  }