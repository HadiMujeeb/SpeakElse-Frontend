import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Participant } from '../../../shared/models/participant.interface';
import { io, Socket } from 'socket.io-client';
import { setAlternateWeakRefImpl } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService implements OnDestroy {
  private peerConnections = new Map<string, RTCPeerConnection>();
  private localStreamSubject = new BehaviorSubject<MediaStream | null>(null);
  private participantsSubject = new BehaviorSubject<Participant[]>([]);
  private socket: Socket | null = null;

  constructor() {
    this.initializeSocket();
  }

  get participants$(): Observable<Participant[]> {
    return this.participantsSubject.asObservable();
  }

  get localStream$(): Observable<MediaStream | null> {
    return this.localStreamSubject.asObservable();
  }

  private initializeSocket(): void {
    // Initialize socket.io client
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
    });

    // Listen for events from the server
    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    this.socket.on('roomCreated', (roomId: string) => {
      console.log(`Room ${roomId} has been created.`);
    });

    this.socket.on(
      'userJoined',
      (data: { userId: string; socketId: string }) => {
        this.handleUserJoined(data.userId, data.socketId);
      }
    );

    this.socket.on('userLeft', (data: { userId: string }) => {
      this.handleUserLeft(data.userId);
    });

    this.socket.on(
      'offer',
      (data: { sourceId: string; offer: RTCSessionDescriptionInit }) => {
        this.handleOffer(data);
      }
    );

    this.socket.on(
      'answer',
      (data: { sourceId: string; answer: RTCSessionDescriptionInit }) => {
        this.handleAnswer(data);
      }
    );

    this.socket.on(
      'ice-candidate',
      (data: { sourceId: string; candidate: RTCIceCandidateInit }) => {
        this.handleIceCandidate(data);
      }
    );

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });
  }

  private async handleUserJoined(userId: string, socketId: string) {
    // Create a peer connection for the new user
    try {
      const peerConnection = await this.createPeerConnection(userId);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send offer to the new user
      this.sendMessage({
        type: 'offer',
        targetId: userId,
        offer,
      });

      // Update participants list
      const currentParticipants = this.participantsSubject.value;
      this.participantsSubject.next([
        ...currentParticipants,
        { id: userId, socketId },
      ]);
    } catch (error) {
      console.error('Error handling user join:', error);
    }
  }

  private async handleUserLeft(userId: string) {
    // Remove peer connection and update participants list
    const peerConnection = this.peerConnections.get(userId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(userId);
    }

    const currentParticipants = this.participantsSubject.value;
    this.participantsSubject.next(
      currentParticipants.filter((p) => p.id !== userId)
    );
  }

  private async handleOffer({
    sourceId,
    offer,
  }: {
    sourceId: string;
    offer: RTCSessionDescriptionInit;
  }) {
    // Handle offer from another user
    try {
      const peerConnection = await this.createPeerConnection(sourceId);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      this.sendMessage({
        type: 'answer',
        targetId: sourceId,
        answer,
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  private async handleAnswer({
    sourceId,
    answer,
  }: {
    sourceId: string;
    answer: RTCSessionDescriptionInit;
  }) {
    const peerConnection = this.peerConnections.get(sourceId);
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }

  private async handleIceCandidate({
    sourceId,
    candidate,
  }: {
    sourceId: string;
    candidate: RTCIceCandidateInit;
  }) {
    const peerConnection = this.peerConnections.get(sourceId);
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    }
  }

  private async createPeerConnection(
    userId: string
  ): Promise<RTCPeerConnection> {
    const config: RTCConfiguration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const peerConnection = new RTCPeerConnection(config);
    // this.peerConnections.set(userId, peerConnection);

    const localStream = this.localStreamSubject.value;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    return peerConnection;
  }

  async joinRoom(roomId: string, userId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.localStreamSubject.next(stream);
      const peerConnection = await this.createPeerConnection(userId);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      this.sendMessage({
        type: 'joinRoom',
        roomId,
        userId,
        offer,
      });
  
      // Send each ICE candidate as it is found
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendMessage({
            type: 'store-candidate',
            roomId,
            userId,
            candidate: event.candidate,
          });
        }
      };
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  leaveRoom(roomId: string) {
    const stream = this.localStreamSubject.value;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    this.peerConnections.forEach((connection) => connection.close());
    this.peerConnections.clear();
    this.localStreamSubject.next(null);
    this.participantsSubject.next([]);

    // Emit leave room event
    this.sendMessage({
      type: 'leaveRoom',
      roomId,
    });
  }

  private sendMessage(message: any) {
    if (this.socket) {
      this.socket.emit(message.type, message);
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  async toggleAudio(): Promise<boolean> {
    const stream = this.localStreamSubject.value;
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  async toggleVideo(): Promise<boolean> {
    const stream = this.localStreamSubject.value;
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }
}
