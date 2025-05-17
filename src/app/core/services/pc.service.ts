import { inject, Injectable, signal } from '@angular/core';
import { WsService } from './ws.service';
import SimplePeer from 'simple-peer';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { userData } from '../../shared/models/socket-io.model';

interface SignalData {
  signal: string;
  callerID: string;
  userToSignal: string;
}

interface ExtendedPeer extends SimplePeer.Instance {
  peerID?: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class PcService {
  private peers: ExtendedPeer[] = [];
  localStream: MediaStream | null = null;
  screenStream: MediaStream | null = null;
  private localStreamSubject = new BehaviorSubject<userData|null>(null);
   remoteStreamsSubject = new BehaviorSubject<{ stream: MediaStream; participantId: string,userData: userData ,isAudioEnabled: boolean,isVideoEnabled: boolean}[]>([]);
  router = inject(Router);

  localStream$ = this.localStreamSubject.asObservable();
  remoteStreams$ = this.remoteStreamsSubject.asObservable();
  // user = JSON.parse(localStorage.getItem('userData') || '{}');

  constructor(private wsService: WsService) {
    this.setupSocketListeners();
  }

  // Initialize local media (video/audio)
  initLocalStream(user:any): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {

        
        this.localStream = stream;
        const updatedUserData: userData = {
          userId: user.id,
          username: user.name,
          avatar: user.avatar,
          mediaStream: stream
        };
        this.localStreamSubject.next(updatedUserData);
        // this.processAudioForCC(stream);
      })  
      .catch((err: Error) => {
        console.error('Failed to get user media', err);
      });
  }

  // private processAudioForCC(stream: MediaStream): void {
  //   const recorder = new MediaRecorder(stream);

  //   recorder.ondataavailable = (event: BlobEvent) => {
  //     event.data.arrayBuffer().then((audioBuffer) => {
  //      console.log("audio",audioBuffer);  
  //     });
  //   };

  //   recorder.start(1000); // Send chunks every second
  // }

    startScreenSharing(user:any): void {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then((screenStream: MediaStream) => {
          this.screenStream = screenStream;
  
          // Replace the video track in all peers
          const screenTrack = screenStream.getVideoTracks()[0];
          this.peers.forEach((peer) => {
            const sender = (peer as any)._pc
              .getSenders()
              .find((s: RTCRtpSender) => s.track?.kind === 'video');
            if (sender) {
              sender.replaceTrack(screenTrack);
            }
          });
  
          // Update local stream with screen sharing
          const updatedUserData: userData = {
            userId: user.id,
            username: user.name,
            avatar: user.avatar,
            mediaStream: screenStream,
          };
          this.localStreamSubject.next(updatedUserData);
  
          // Stop screen sharing and revert to the camera when sharing stops
          screenTrack.onended = () => {
            this.stopScreenSharing(user);
          };
        })
        .catch((err: Error) => {
          console.error('Failed to start screen sharing', err);
        });
    }
  
    stopScreenSharing(user:any): void {
      if (this.screenStream) {
        this.screenStream.getTracks().forEach((track) => track.stop());
        this.screenStream = null;
      }
  
      if (this.localStream) {
        const videoTrack = this.localStream.getVideoTracks()[0];
        this.peers.forEach((peer) => {
          const sender = (peer as any)._pc
            .getSenders()
            .find((s: RTCRtpSender) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
  
        // Update local stream back to the camera
        const updatedUserData: userData = {
          userId: user.id,
          username: user.name,
          avatar: user.avatar,
          mediaStream: this.localStream,
        };
        this.localStreamSubject.next(updatedUserData);
      }
    }
  // Set up listeners for signaling
  private setupSocketListeners(): void {
    this.wsService.onAllUsers((users: userData[]) => {
      console.log("users",users);
        users.forEach((userData: userData) => {
          if (this.localStream && this.wsService.getSocketId()) {
            this.createPeer(userData, this.wsService.getSocketId(), this.localStream);
          }
        });
    });

    this.wsService.onUserJoined((signal:string,userData:userData) => {
      if (this.localStream) {
        this.addPeer(signal, userData.socketId||'', this.localStream,userData);
      }
    });

    this.wsService.onReceivingReturnedSignal((data: { signal: string; id: string }, roomID: string) => {
      const peer = this.peers.find(p => p.peerID === data.id);
      if (peer) {
        peer.signal(data.signal);
      }
    });
  }

  // Create a new peer connection for a new user
  private createPeer(userData:userData, callerID: string, stream: MediaStream): void {
    const peer: ExtendedPeer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream
    });
   const userToSignal = userData.socketId || '';
    peer.on('signal', (signal: string) => {
      const signalData: SignalData = { userToSignal, callerID, signal };
      this.wsService.sendingSignal(signalData);
    });

    peer.on('stream', (stream: MediaStream) => this.handleIncomingStream(stream, userToSignal, userData));
    peer.peerID = userToSignal;
    this.peers.push(peer);
  }

  // Add a peer when a new user joins
  addPeer(signal: string, callerID: string, stream: MediaStream, userData: userData): void {
    const peer: ExtendedPeer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (signal: string) => {
      this.wsService.returningSignal({ signal, callerID });
    });

    peer.on('stream', (stream: MediaStream) => this.handleIncomingStream(stream, callerID, userData));

    if (peer && typeof peer.signal === 'function') {
      peer.signal(signal);
    } else {
      console.error("Peer is not fully initialized or 'signal' method is missing.");
    }

    peer.peerID = callerID;
    this.peers.push(peer);
  }

  // Handle incoming remote stream
  private handleIncomingStream(stream: MediaStream, participantId: string, userData: userData ): void {
    console.log("stream",stream,"userid",participantId)
    const remoteStreams = this.remoteStreamsSubject.value;

    // Check if the participant's stream already exists
    const existingStreamIndex = remoteStreams.findIndex(r => r.participantId === participantId);
    if (existingStreamIndex !== -1) {
      remoteStreams[existingStreamIndex].stream = stream; // Update stream if necessary
    } else {
      remoteStreams.push({ stream, participantId ,userData,isAudioEnabled: true,isVideoEnabled: true});
    }

    this.remoteStreamsSubject.next([...remoteStreams]); // Emit updated remote streams array

  }

  // Remove a remote stream when a participant disconnects
  handlePeerDisconnect(peerID: string): void {
    const peerIndex = this.peers.findIndex(p => p.peerID === peerID);
    if (peerIndex !== -1) {
      this.peers[peerIndex].destroy();
      this.peers.splice(peerIndex, 1);
    }

    // Remove the remote stream associated with the disconnected peer
    const remoteStreams = this.remoteStreamsSubject.value.filter(r => r.participantId !== peerID);
    this.remoteStreamsSubject.next(remoteStreams);
  }
 
  


  // End the local stream and close all peer connections
  closeAllConnections(): void {
    // this.localStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    this.peers.forEach((peer: ExtendedPeer) => peer.destroy());
    this.peers = [];
    this.remoteStreamsSubject.next([]); // Clear remote streams
  }
}