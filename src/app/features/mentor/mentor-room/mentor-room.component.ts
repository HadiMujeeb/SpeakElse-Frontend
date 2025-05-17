import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { userData } from '../../../shared/models/socket-io.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../core/services/user/room.service';
import { WsService } from '../../../core/services/ws.service';
import { PcService } from '../../../core/services/pc.service';
import { CommonModule } from '@angular/common';
import { ControlBarComponent } from '../../../shared/components/video-conference/room-controls/control-bar.component';
import { FormsModule } from '@angular/forms';
import { NavLogoComponent } from '../../../layouts/user/nav-logo/nav-logo.component';
import { ChatSidebarComponent } from '../../../shared/components/video-conference/room-chat/chat-sidebar.component';

@Component({
  selector: 'app-mentor-room',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ControlBarComponent,
    NavLogoComponent,
    ChatSidebarComponent,
  ],
  templateUrl: './mentor-room.component.html',
  styleUrl: './mentor-room.component.css',
})
export class MentorRoomComponent implements OnInit, OnDestroy {
  modalOpen: boolean = false;
  screenSharing: boolean = false;
  getRaterId: string = '';
  isRoomJoined: boolean = false;
  showRatingModal: boolean = false;
  isChatOpen: boolean = false;
  isReportOpen: boolean = false;
  reportUserId: string = '';
  memberType: string | null = null;

  // Room-related properties
  roomID: string = '';
  messages: string[] = [];
  remoteParticipants: {
    stream: MediaStream;
    participantId: string;
    userData: userData;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
  }[] = [];
  selectedParticipant: any = null;

  // Streams-related properties
  localStream: userData | null = null;
  isAudioEnabled: boolean = true;
  isVideoEnabled: boolean = true;

  // Friends-related properties
  followers: any[] = [];
  following: any[] = [];

  // Current user (mentor or user)
  currentUser:any

  // Injected services
  router = inject(Router);
  userRoomServices = inject(RoomService);

  constructor(
    private wsService: WsService,
    private pcService: PcService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.memberType = this.userRoomServices.getMemberType();

    if (this.memberType === 'MENTOR') {
      console.log('Mentor joined the room');
      this.currentUser = JSON.parse(localStorage.getItem('mentorData') || '{}');
    } else {
      console.log('User joined the room');
      this.currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    }

    this.initializeLocalStream();
    this.subscribeToStreamEvents();
    this.subscribeToSocketEvents();
  }

  ngOnDestroy(): void {
    this.leaveRoom();
  }

  private initializeLocalStream(): void {
    if (this.currentUser) {
      this.pcService.initLocalStream(this.currentUser);
      this.pcService.localStream$.subscribe((streamData) => {
        if (streamData) {
          this.localStream = streamData;
        }
      });
    }
  }

  private subscribeToStreamEvents(): void {
    this.pcService.remoteStreams$.subscribe((remoteStreams) => {
      this.remoteParticipants = remoteStreams;
      console.log('remoteParticipants', this.remoteParticipants);
    });
  }

  private subscribeToSocketEvents(): void {
    this.wsService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.wsService.onUserLeft((socketId: string) => {
      this.remoteParticipants = this.remoteParticipants.filter(
        (participant) => participant.userData.socketId !== socketId
      );
      this.pcService.remoteStreamsSubject.next(this.remoteParticipants);
    });

    this.wsService.onyouLeft(() => {
      if (this.localStream?.mediaStream) {
        this.localStream.mediaStream.getTracks().forEach((track) => track.stop());
        this.localStream = null;
      }
      this.pcService.closeAllConnections();
      this.router.navigate(['/mentor/main/sessions']);
    });

    this.wsService.onUserAudioStatusChange((userId: string) => {
      this.remoteParticipants.forEach((participant) => {
        if (participant.participantId === userId) {
          participant.isAudioEnabled = !participant.isAudioEnabled;
        }
      });
    });

    this.wsService.onUserVideoStatusChange((userId: string) => {
      this.remoteParticipants.forEach((participant) => {
        if (participant.participantId === userId) {
          participant.isVideoEnabled = !participant.isVideoEnabled;
        }
      });
    });
  }

  joinRoom(): void {
    this.isRoomJoined = true;
    this.roomID = this.activeRoute.snapshot.paramMap.get('roomId') || '';
    if (this.roomID && this.currentUser) {
      this.wsService.joinRoom(this.roomID, this.currentUser);
    }
  }

  leaveRoom(): void {
    if (this.currentUser) {
      this.wsService.leaveRoom(this.currentUser.id);
    }
    if (this.localStream?.mediaStream) {
      this.localStream.mediaStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.pcService.closeAllConnections();
    this.userRoomServices.removeMemberType()
    this.router.navigate(['/mentor/main/sessions']);
  }

  toggleAudio(): void {
    if (this.localStream?.mediaStream) {
      this.isAudioEnabled = !this.isAudioEnabled;
      this.localStream.mediaStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = this.isAudioEnabled));
      this.wsService.updateAudioStatus();
    }
  }

  toggleVideo(): void {
    if (this.localStream?.mediaStream) {
      this.isVideoEnabled = !this.isVideoEnabled;
      this.localStream.mediaStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = this.isVideoEnabled));
      this.wsService.updateVideoStatus();
    }
  }

  shareScreen(): void {
    if (!this.screenSharing && this.currentUser) {
      this.pcService.startScreenSharing(this.currentUser);
    } else if (this.screenSharing && this.currentUser) {
      this.pcService.stopScreenSharing(this.currentUser);
    }
    this.screenSharing = !this.screenSharing;
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(message: string): void {
    if (this.currentUser) {
      this.wsService.sendMessage(message, this.currentUser.name);
      this.messages.push(`You: ${message}`);
    }
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  openRatingModal(userId: string): void {
    this.getRaterId = userId;
    this.showRatingModal = true;
  }

  selectParticipant(participant: any): void {
    this.selectedParticipant = participant;
  }

  closeReportModal(): void {
    this.isReportOpen = false;
  }

  reportUser(userId: string): void {
    this.isReportOpen = true;
    this.reportUserId = userId;
  }
}
