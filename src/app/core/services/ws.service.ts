import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { IMember } from '../../shared/models/member.model';
import { userData } from '../../shared/models/socket-io.model';
import { IMessage } from '../../shared/models/chat-message.model';
import { environment } from '../../../environment/environment.development';
import { IUserCreatedRoom, RoomInfo } from '../../shared/models/room.model';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  public socket!: Socket;
  private privateMessageSubject = new Subject<IMessage>();
  private statusSubject = new Subject<string>();
  private messageSubject = new Subject<string>();

  private roomCreatedSubject = new Subject<IUserCreatedRoom>();
  
  roomID: string = '';
  privateChatID: string = '';
  userData: IMember = JSON.parse(localStorage.getItem('userData') || '{}');
  constructor() {
    // Initialize the socket connection to the server 
    this.socket = io(environment.BACKEND_DOMAIN);
    this.socket.on('new chat message', (message: string) => {
      this.messageSubject.next(message);
      console.log("new message",message);
    });

    this.socket.on('room-created', (room: IUserCreatedRoom) => {
      console.log("Room created received:", room);
      this.roomCreatedSubject.next(room);
    }); 
  }

  broadcastCreateRoom(room: IUserCreatedRoom): void {
    this.socket.emit('room-created', room);
  }
  onRoomCreated(): Observable<IUserCreatedRoom> {
    return this.roomCreatedSubject.asObservable();
  }

  updateRoomCountWithParticipant(roomId: string, participantId: string): void {
    this.socket.emit('update-room-count', { roomId, participantId });
  }
  
  onRoomCountUpdated(callback: (data: { roomId: string; participantId: string ,count:number}) => void): void {
    this.socket.on('room-count-updated', callback);
  }

  joinPrivateChat(chatId: string): void {
    this.socket.emit('join private chat', chatId);
  }
  leavePrivateChat(chat: string,lastTime:string): void {

      this.socket.emit('leave private chat', chat,lastTime);
  }

  sendPrivateMessage(message: IMessage): void {

      this.socket.emit('private chat message', message);
      console.log("sent message",message);
    
  }

  onPrivateMessage(): Observable<IMessage> {
    this.socket.on('private chat message', (message: IMessage) => {
      console.log("reverced",message)
      this.privateMessageSubject.next(message);
    });
    return this.privateMessageSubject.asObservable();
  }

  onFriendStatus(): Observable<string> {
    this.socket.on('friend online', (status: string) => {
      this.statusSubject.next(status);
    });
    this.socket.on('friend offline', (status: string) => {
      this.statusSubject.next(status);
    });
    return this.statusSubject.asObservable();
  }

  sendMessage(message: string,username:string): void {
    this.socket.emit('chat message', message, this.roomID, username);
  } 

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }
  getSocketId(): string {
    if (!this.socket.id) {
      throw new Error('Socket ID is not available');
    }
    return this.socket.id;
  }
  leaveRoom(userId:string): void {
    if (this.roomID) {
      this.socket.emit('leave room', this.roomID,userId);
      this.roomID = '';
    }
  }
  onUserLeft(callback: (socketId:string) => void): void {
    this.socket.on('user-left', callback);
  }
  onyouLeft(callback: () => void): void {
    this.socket.on('you-left', callback);
  }

  // Join a room on the server
  joinRoom(roomID: string,userData:any): void {
    if (userData) {
      this.socket.emit('set user data', {
        userId: userData.id,
        username: userData.name,
        avatar: userData.avatar,
      });
    }
    this.roomID = roomID;
    this.socket.emit('join room', roomID);
    
  }

  // Listen for the 'all users' event to receive existing users in the room
  onAllUsers(callback: (users: userData[], roomID: string) => void): void {
    this.socket.on('all users', (user: userData[]) => {
      callback(user, this.roomID);
    });
  }



    onUserJoined(callback: (singal:string,userData:userData) => void): void {
      this.socket.on('user joined', callback);
    }
  
  onReceivingReturnedSignal(
    callback: (data: { signal: string; id: string }, roomID: string) => void
  ): void {
    this.socket.on('receiving returned signal', (data) => {
      callback(data, this.roomID);
    });
  }

  // Send a signal to another user (used for the SDP offer or ICE candidates)
  sendingSignal(payload: {
    userToSignal: string;
    callerID: string;
    signal: string;
  }): void {
    this.socket.emit('sending signal', payload);
  }

  // Return a signal back to the caller (used for SDP answer or ICE candidates)
  returningSignal(payload: { signal: string; callerID: string }): void {
    this.socket.emit('returning signal', payload);
  }


  updateAudioStatus(): void {
    this.socket.emit('update audio status',this.roomID);
  }
  
  updateVideoStatus(): void {
    this.socket.emit('update video status',this.roomID);
  }

  onUserAudioStatusChange(callback: (userId: string) => void): void {
    this.socket.on('audio status updated', callback);
  }
  
  // Listen for video status changes
  onUserVideoStatusChange(callback: (userId: string) => void): void {
    this.socket.on('video status updated', callback);
  }
  // Listen for user disconnect event
  onUserDisconnect(callback: () => void): void {
    this.socket.on('disconnect', callback);
  }

  getAllRoomsInfo(): void {
    this.socket.emit('get all rooms info');
  }
  
  onRoomsInfo(callback: (roomsInfo: RoomInfo[]) => void): void {
    this.socket.on('rooms info', callback);
  }
  addRoomtoBackend(roomData:IUserCreatedRoom):void{
    this.socket.emit('add-room',roomData)
  }
 

  deletedRoom(callback:(roomId:string)=> void):void {
  this.socket.on('room deleted',callback)

  }
}
