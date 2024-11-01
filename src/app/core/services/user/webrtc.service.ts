  import { Injectable } from '@angular/core';

  @Injectable({
    providedIn: 'root',
  })
  export class WebrtcService {
    private peerConnection!: RTCPeerConnection;
    private localStream!: MediaStream;
    private remoteStream!: MediaStream;

    constructor() {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.1.google.com:19302' }],
      });

      this.remoteStream = new MediaStream();

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('ICE Candidate:', event.candidate);
        }
      };

      this.peerConnection.ontrack = (event) => {
        this.remoteStream.addTrack(event.track);
      };
    }


    async getLocalStream(): Promise<MediaStream> {
      console.log("workingcscdc")
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
      });
      return this.localStream
    }

    addLocalStream(): void {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }

    async createOffer(): Promise<RTCLocalSessionDescriptionInit>{
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    }


  }

