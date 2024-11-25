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

export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  profession?: string | null;
  language?: string | null;
  country?: string | null;
  description?: string | null;
}