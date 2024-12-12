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
    
}