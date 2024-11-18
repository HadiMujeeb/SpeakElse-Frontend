import { Component, OnInit, inject } from '@angular/core';
import { WsService } from '../../../core/services/ws.service';
import { PcService } from '../../../core/services/pc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlBarComponent } from '../../../shared/components/video-conference/room-controls/control-bar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavLogoComponent } from '../../../shared/layouts/nav-logo/nav-logo.component';
import { ChatSidebarComponent } from '../../../shared/components/video-conference/room-chat/chat-sidebar.component';
import { userData } from '../../../shared/models/socket-io.model';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    FormsModule,
    ControlBarComponent,
    CommonModule,
    NavLogoComponent,
    ChatSidebarComponent,
  ],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  isRoomJoined: boolean = false;
  roomID: string = '';
  localStream: userData | null = null;
  isAudioEnabled: boolean = true;
  isVideoEnabled: boolean = true;
  remoteParticipants: { stream: MediaStream; participantId: string,userData: userData,isAudioEnabled: boolean,isVideoEnabled: boolean }[] = [];
  messages: string[] = [];
  isChatOpen: boolean = false;
  router = inject(Router);

  constructor(
    private wsService: WsService,
    private pcService: PcService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.pcService.initLocalStream();
    this.pcService.localStream$.subscribe((streamData) => {
      if (streamData) {
        this.localStream = streamData;
      }
    });
    this.pcService.remoteStreams$.subscribe((remoteStreams) => {

      this.remoteParticipants = remoteStreams;
      console.log("remoteParticipants",this.remoteParticipants);
    });

    this.wsService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.wsService.onUserLeft((participantId: string) => {
      this.onUserLeft(participantId);
    });

    this.wsService.onUserAudioStatusChange((userId: string) => {
       this.remoteParticipants.map((participant) => {
         if(participant.participantId === userId){
          participant.isAudioEnabled = !participant.isAudioEnabled;
          console.log("auto",participant.isAudioEnabled);
         }
      })
    })

    this.wsService.onUserVideoStatusChange((userId: string) => {
      this.remoteParticipants.map((participant) => {
        if(participant.participantId === userId){
         participant.isVideoEnabled = !participant.isVideoEnabled;
         console.log("video",participant.isVideoEnabled);
        }
     })
   })
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(message: any): void {
    this.wsService.sendMessage(message);
    this.messages.push(`You: ${message}`);
  }

  // Join the room
  joinRoom(): void {
    this.isRoomJoined = true;
    this.roomID = this.activeRoute.snapshot.paramMap.get('roomId') || '';
    if (this.roomID) {
      this.wsService.joinRoom(this.roomID);
    }
  }

  // Handle when a user leaves the room
  onUserLeft(participantId: string): void {
    this.pcService.handlePeerDisconnect(participantId);
  }


  toggleAudio(): void {
    if (this.localStream?.mediaStream) {
      this.isAudioEnabled = !this.isAudioEnabled;
      this.localStream.mediaStream.getAudioTracks().forEach((track) => (track.enabled = this.isAudioEnabled));
      this.wsService.updateAudioStatus();
    }
  }

  // Toggle video track on/off
  toggleVideo(): void {
    if (this.localStream?.mediaStream) {
      this.isVideoEnabled = !this.isVideoEnabled;
      this.localStream.mediaStream.getVideoTracks().forEach((track) => (track.enabled = this.isVideoEnabled));
      this.wsService.updateVideoStatus();
    }
  }


  leaveRoom(): void {
    // Stop the local stream
    if (this.localStream?.mediaStream) {
      this.localStream.mediaStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.pcService.closeAllConnections();

    // Emit a 'leave room' event to the server
    this.wsService.leaveRoom();

    this.router.navigate(['/user/roomList']);
  }
}
