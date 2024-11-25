
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
  }