import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  public socket!: Socket;
  private messageSubject = new Subject<string>();
  roomID:string='';
  constructor() {
    // Initialize the socket connection to the server
    this.socket = io('ws://localhost:3000');
    this.socket.on('new chat message', (message: string) => {
      this.messageSubject.next(message);
    });
  }

  sendMessage(message: string,): void {
    this.socket.emit('chat message', message,this.roomID);
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }
  getSocketId(): string {
    if (!this.socket.id) {
      throw new Error("Socket ID is not available");
    }
    return this.socket.id;
  }
  leaveRoom(): void {
    if (this.roomID) {
      this.socket.emit('leave room', this.roomID);
      this.roomID = ''; // Reset room ID
    }
  }
  

  // Join a room on the server
  joinRoom(roomID: string): void {
   this.roomID=roomID
    this.socket.emit('join room', roomID);
  }

  // Listen for the 'all users' event to receive existing users in the room
  onAllUsers(callback: (users: string[],roomID: string) => void): void {
    this.socket.on('all users',(user:string[])=>{
      callback(user,this.roomID);
    });
  }

  // Listen for the 'user joined' event to get notified when a user joins
  onUserJoined(callback: (data: { callerID: string, signal: string }) => void): void {
    this.socket.on('user joined', callback);
  }

  // Listen for the 'receiving returned signal' event to get a signal back
  onReceivingReturnedSignal(callback: (data: { signal: string, id: string},roomID: string) => void): void {
    this.socket.on('receiving returned signal', (data)=>{
      callback(data,this.roomID);
    });
  }

  // Send a signal to another user (used for the SDP offer or ICE candidates)
  sendingSignal(payload: { userToSignal: string, callerID: string, signal: string }): void {
    this.socket.emit('sending signal', payload);
  }

  // Return a signal back to the caller (used for SDP answer or ICE candidates)
  returningSignal(payload: { signal: string, callerID: string }): void {
    this.socket.emit('returning signal', payload);
  }

  // Listen for user disconnect event
  onUserDisconnect(callback: () => void): void {
    this.socket.on('disconnect', callback);
  }
}
