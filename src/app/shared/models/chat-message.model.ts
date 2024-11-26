
export interface ChatMessage {
    id: string;          // Unique identifier for the chat message
    senderId: string;    // ID of the sender of the message
    senderName: string;   // Name of the sender
    content: string;      // The content of the message
    timestamp: Date;      // Timestamp of when the message was sent
  }
  
  export interface Signal{
    event: string;
    data: any;
}


export interface IChat {
  id: string;
  messages?: IMessage[]|null;
  createdAt: Date;
  updatedAt: Date;
  friend?:{
    id: string;
    name: string;
    avatar: string
  }
}

export interface IMessage {
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}
