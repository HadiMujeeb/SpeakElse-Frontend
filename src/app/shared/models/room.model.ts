export interface IrequestCreateRoom {
 creatorId : string;   
 topic : string;
 Level : string;
 language : string;
 maxPeople : string;
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
