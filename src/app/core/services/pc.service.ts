import { inject, Injectable } from '@angular/core';
import { WsService } from './ws.service';
import SimplePeer from 'simple-peer';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

interface SignalData {
  signal: string;
  callerID: string;
  userToSignal: string;
}

interface UserData {
  signal: string;
  callerID: string;
  id: string;
}

// Extending SimplePeer.Instance to include custom peerID
interface ExtendedPeer extends SimplePeer.Instance {
  peerID?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PcService {
  private peers: ExtendedPeer[] = []; // Array of SimplePeer instances with peerID
   localStream: MediaStream | null = null; // MediaStream for local video/audio
   private localStreamSubject = new BehaviorSubject<MediaStream | null>(null);
   router = inject(Router)
   // Observable for components to subscribe to
   localStream$ = this.localStreamSubject.asObservable();
  constructor(private wsService: WsService) {
    this.setupSocketListeners();
  }

  // Initialize local media (video/audio)
  initLocalStream(): void {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        this.localStream = stream;
        this.localStreamSubject.next(this.localStream); 
        // Pass the local stream to any component that needs it, or store it to be used in peers
      })
      .catch((err: Error) => {
        console.error('Failed to get user media', err);
      });
  }

  // Set up listeners for signaling
  private setupSocketListeners(): void {
    this.wsService.onAllUsers((users: string[], roomID: string) => {
      console.log(users.length, 'users length')
      if(users.length==0) {
        console.log('no users')
        // this.router.navigate([`/user/room/${roomID}`])
      }else{
      users.forEach((userID: string) => {
        if (this.localStream && this.wsService.getSocketId()) {
          this.createPeer(userID, this.wsService.getSocketId(), this.localStream);
        }
      });
    }
    });

    this.wsService.onUserJoined((data: any) => {
      if (this.localStream) {
        console.log('User joined:', data);
        this.addPeer(data.signal, data.callerID, this.localStream);
      }
    });

    this.wsService.onReceivingReturnedSignal((data: { signal: string, id: string}, roomID: string) => {
      const peer = this.peers.find(p => p.peerID === data.id);
      if (peer) {
        peer.signal(data.signal);
        // this.router.navigate([`/user/room/${roomID}`])
      }
    });
  }

  // Create a new peer connection for a new user
  private createPeer(userToSignal: string, callerID: string, stream: MediaStream): void {
    const peer: ExtendedPeer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (signal: string) => {
      // Send the signal to the other user
      const signalData: SignalData = { userToSignal, callerID, signal };
      this.wsService.sendingSignal(signalData);
    });

    peer.on('stream', this.handleIncomingStream);

    peer.peerID = userToSignal; // Add peerID to the peer instance
    this.peers.push(peer);
  }

  // Add a peer when a new user joins
    addPeer(signal: string, callerID: string, stream: MediaStream): void {
    const peer: ExtendedPeer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (signal: string) => {
      // Return the signal to the caller
      this.wsService.returningSignal({ signal, callerID });
    });

    peer.on('stream', this.handleIncomingStream);

    if (peer && typeof peer.signal === 'function') {
      peer.signal(signal);
    } else {
      console.error("Peer is not fully initialized or 'signal' method is missing.");
    }
  
    peer.peerID = callerID; // Add peerID to the peer instance
    this.peers.push(peer);
  }

  // Handle incoming stream from the remote peer
   handleIncomingStream(stream: MediaStream): void {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    document.getElementById('videos')?.appendChild(video);
  }

  // Handle disconnect event from a peer
  handlePeerDisconnect(peerID: string): void {
    const peerIndex = this.peers.findIndex(p => p.peerID === peerID);
    if (peerIndex !== -1) {
      const peer = this.peers[peerIndex];
      peer.destroy(); // Destroy the peer connection
      this.peers.splice(peerIndex, 1); // Remove the peer from the list
    }
  }

  // End the local stream and close all peer connections
  closeAllConnections(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop()); // Stop all media tracks
    }

    this.peers.forEach((peer: ExtendedPeer) => peer.destroy()); // Destroy all peer connections
    this.peers = []; // Reset peers array
  }
}
