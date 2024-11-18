export interface SignalData {
    signal: any; 
    callerID: string;
    userToSignal?: string;
  }


  export interface userData {
    socketId?: string;
    userId: string;
    username: string;
    avatar: string;
    mediaStream: MediaStream|null; 
  }

  export interface IChatMessage {
    sender: string;
    content: string;
    timestamp?: Date; 
  }