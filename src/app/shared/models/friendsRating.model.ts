
export  interface IReponseRatings {
    userId: string;
    feedback: string;
    rating: number;
    date: Date;
    givenBy:{
      name:string;
      avatar:string;
    }
}
  
export interface IComment {
    userId: string;
    feedback: string;
    rating: number;
    givenBy: string;
  }