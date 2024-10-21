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
}
