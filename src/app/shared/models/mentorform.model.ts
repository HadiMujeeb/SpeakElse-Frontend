import { ITransaction } from "./friendsRating.model"
import { IUser } from "./member.model"

export interface IApplication {
    id        :   string
    name      :   string
    email     :   string   
    password  :   string
    avatar    :   string|null
    country   :   string
    language  :   string
    mentorRole :  string
    description :  string
    resume     :  string
    userId     :  string
    isVerified? :  boolean
    isBlocked?  :  boolean
    followers?  :  string[]
    following?  :  string[]
    ratings?    :  string[]
    approvalStatus? : string
    user?:IUser
    isMailSend: number
    createdAt  :  Date
    mentorWallet?: ImentorWallet
}

export interface IMentorRoom {
    id        :   string
    mentorId  :   string
    language  :   string
    topic     :   string
    limit     :   number
    participants : string[]
    startTime : Date
    endTime   : Date
    createdAt : Date
    bookingFee : number
    mentor?:IApplication
    rescheduleCount : number 
    rescheduleReason : string[]
    status?:string
    
}
export interface ImentorWallet {
    id: string;
    mentorId: string;
    balance: number;
    transactions?: ITransaction[];
  }


  export interface IReshedulement {
    roomId    : string
    startTime : Date
    endTime   : Date
    reason    : string
  }