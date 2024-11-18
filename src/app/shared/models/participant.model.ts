export interface Participant {

    id: string;        
    name?: string;      
    isMuted?: boolean;  
    isVideoOn?: boolean;
    stream?: MediaStream; 
    socketId?: string;
    
    
  }