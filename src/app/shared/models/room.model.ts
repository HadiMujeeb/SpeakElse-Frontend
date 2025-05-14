export interface IrequestCreateRoom {
 creatorId : string;   
 topic : string;
 Level : string;
 language : string;
 maxPeople : string;
 privacy: "PUBLIC" |"PRIVATE";
}

export interface IRoom {
    id: string;
    creatorId: string;
    level: string;
    maxPeople: number; 
    participants: any[]; 
    privacy: string;
    topic: string;
    language: string;
    createdAt: Date;
    creator: {
        avatar: string;
        name: string;
        country: string;
        language: string;
        profession: string;
        id: string;
        rating: string;

    
    };
 
}

export interface IUserCreatedRoom {
    id: string;
    language?: string;
    topic?: string;
    peopleCount: {
        joined: number;
        limit: number
      };
    level: string;
    privacy: string;
    participants: string[];
    createdAt: Date;
    creator:{
      id: string;
      name:string;
      country?:string;
      profession?:string;
      avatar?: string;
    }
    }

    export interface RoomInfo {
        roomId: string;
        memberCount: number;
        members: string[]; // Array of userIds
      }
      

    export interface IReponseCreatedRoom {
        message:string;
        room:IUserCreatedRoom
    }

    export interface IResponseGellAllRoom {
        message:string;
        rooms:IUserCreatedRoom[]
    }
