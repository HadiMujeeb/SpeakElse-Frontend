import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WsService } from '../../../core/services/ws.service';
import { PcService } from '../../../core/services/pc.service';
import { FormsModule } from '@angular/forms';
import { ControlBarComponent } from '../../../shared/components/video-conference/control-bar/control-bar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavLogoComponent } from '../../../layouts/nav-logo/nav-logo.component';
import { ChatSidebarComponent } from '../../../shared/components/video-conference/chat-sidebar/chat-sidebar.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [FormsModule, ControlBarComponent, CommonModule, NavLogoComponent,ChatSidebarComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent implements OnInit {
  @ViewChild('myVideo') myVideoElement!: ElementRef<HTMLVideoElement>;
  isRoomJoined: boolean = false;
  roomID: string = '';
  localStream: MediaStream | null = null;
  isAudioEnabled: boolean = true; // To keep track of audio state
  isVideoEnabled: boolean = true; // To keep track of video state
  remoteParticipants: any[] = [];
  messages: string[] = [];
  isChatOpen: boolean = false;
  router = inject(Router);
  constructor(
    private wsService: WsService,
    private pcService: PcService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize the local stream
    this.pcService.initLocalStream();
    this.pcService.localStream$.subscribe((stream) => {
      if (stream) {
        this.localStream = stream;
        this.myVideoElement.nativeElement.srcObject = stream;
        this.myVideoElement.nativeElement.muted = true;
      }
    });
    // Listen for remote video streams and handle them
    this.pcService.handleIncomingStream = this.addRemoteVideo;

    this.wsService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    console.log(this.isChatOpen, 'isChatOpen');
  }

  sendMessage(message: any): void {
    this.wsService.sendMessage(message);
    this.messages.push(`You: ${message}`);
  }
  // Join a room
  joinRoom(): void {
    this.isRoomJoined = true;
    this.roomID = this.activeRoute.snapshot.paramMap.get('roomId') || '';
    if (this.roomID) {
      this.wsService.joinRoom(this.roomID);
    }
  }

  // Add a remote video stream to the page
  addRemoteVideo(stream: MediaStream): void {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    document.getElementById('remote-videos')?.appendChild(video);
  }

  onUserJoined(data: any): void {
    this.pcService.addPeer(data.signal, data.callerID, this.localStream!);
  }
  toggleAudio(): void {
    if (this.localStream) {
      this.isAudioEnabled = !this.isAudioEnabled;
      this.localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = this.isAudioEnabled));
    }
  }

  // Toggle video track on/off
  toggleVideo(): void {
    if (this.localStream) {
      this.isVideoEnabled = !this.isVideoEnabled;
      this.localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = this.isVideoEnabled));
    }
  }

  // Handle local video stream updates
  onLocalStreamReady(stream: MediaStream): void {
    this.localStream = stream;
    this.myVideoElement.nativeElement.srcObject = stream;
  }
  leaveRoom(): void {
    // Stop the local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.pcService.closeAllConnections();

    // Emit a 'leave room' event to the server (if needed)
    this.wsService.leaveRoom();

    this.router.navigate(['/user/roomList']);
  }
}
