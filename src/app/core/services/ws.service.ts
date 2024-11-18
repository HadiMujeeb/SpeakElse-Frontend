import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { IMember } from '../../shared/models/member.model';
import { userData } from '../../shared/models/socket-io.model';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  public socket!: Socket;
  private messageSubject = new Subject<string>();
  roomID: string = '';
  userData: IMember = JSON.parse(localStorage.getItem('userData') || '{}');
  constructor() {
    // Initialize the socket connection to the server
    this.socket = io('ws://localhost:3000');
    this.socket.on('new chat message', (message: string) => {
      this.messageSubject.next(message);
    });
  }

  sendMessage(message: string): void {
    this.socket.emit('chat message', message, this.roomID, this.userData.name);
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
  leaveRoom(): void {
    if (this.roomID) {
      this.socket.emit('leave room', this.roomID);
      this.roomID = '';
    }
  }
  onUserLeft(callback: (participantId: string) => void): void {
    this.socket.on('user-left', callback);
  }

  // Join a room on the server
  joinRoom(roomID: string): void {
    this.roomID = roomID;
    this.socket.emit('join room', roomID);
    if (this.userData) {
      this.socket.emit('set user data', {
        userId: this.userData.id,
        username: this.userData.name,
        avatar: this.userData.avatar,
      });
    }
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
    console.log("working 1 audio status");
    this.socket.emit('update audio status',this.roomID);
  }
  
  updateVideoStatus(): void {
    console.log("working 1 video status");
    this.socket.emit('update video status',this.roomID);
  }

  onUserAudioStatusChange(callback: (userId: string) => void): void {
    console.log("working 2 audio status");
    this.socket.on('audio status updated', callback);
  }
  
  // Listen for video status changes
  onUserVideoStatusChange(callback: (userId: string) => void): void {
    console.log("working 2 video status");  
    this.socket.on('video status updated', callback);
  }
  // Listen for user disconnect event
  onUserDisconnect(callback: () => void): void {
    this.socket.on('disconnect', callback);
  }
}
