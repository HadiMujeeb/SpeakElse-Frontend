import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { WsService } from '../../../core/services/ws.service';
import { PcService } from '../../../core/services/pc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ControlBarComponent } from '../../../shared/components/video-conference/room-controls/control-bar.component';
import { NavLogoComponent } from '../../../layouts/user/nav-logo/nav-logo.component';
import { ChatSidebarComponent } from '../../../shared/components/video-conference/room-chat/chat-sidebar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';

import { userData } from '../../../shared/models/socket-io.model';
import { IUser } from '../../../shared/models/member.model';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { CallendComponent } from '../../../shared/components/callend/callend.component';
import { ReportModalComponent } from '../../../shared/components/modals/report-modal/report-modal.component';
import { RoomService } from '../../../core/services/user/room.service';
// import { FriendChatService } from '../../../core/services/friend-chat.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ControlBarComponent,
    NavLogoComponent,
    ChatSidebarComponent,
    RatingComponent,
    CallendComponent,
    ReportModalComponent
  ],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit , OnDestroy {
  modalOpen: boolean = false;
  screenSharing : boolean = false;
  getRaterId: string = '';
  isRoomJoined: boolean = false;
  showRatingModal: boolean = false;
  isChatOpen: boolean = false;
  isReportOpen: boolean = false;
  reportUserId: string = '';
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

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }
  // Injected services
  router = inject(Router);
  userRoomServices = inject(RoomService);
  userId = JSON.parse(localStorage.getItem('userData') || '{}').id;

  constructor(
    private wsService: WsService,
    private pcService: PcService,
    private activeRoute: ActivatedRoute,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.initializeLocalStream();
    this.subscribeToStreamEvents();
    this.subscribeToSocketEvents();
    this.updateFriendsList();
  }

  ngOnDestroy(): void {
    this.leaveRoom()
  }

  // Stream-related methods
  private initializeLocalStream(): void {
    this.pcService.initLocalStream();
    this.pcService.localStream$.subscribe((streamData) => {
      if (streamData) {
        this.localStream = streamData;
      }
    });
  }

  private subscribeToStreamEvents(): void {
    this.pcService.remoteStreams$.subscribe((remoteStreams) => {
      this.remoteParticipants = remoteStreams;
      console.log('remoteParticipants', this.remoteParticipants);
    });
  }

  // Socket event subscriptions
  private subscribeToSocketEvents(): void {
    this.wsService.getMessages().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.wsService.onUserLeft((socketId: string) => {
      console.log('user left', socketId);
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
      this.router.navigate(['/user/roomList']);   
    });

    this.wsService.onUserAudioStatusChange((userId: string) => {
      this.remoteParticipants.map((participant) => {
        if (participant.participantId === userId) {
          participant.isAudioEnabled = !participant.isAudioEnabled;
          console.log('audio', participant.isAudioEnabled);
        }
      });
    });

    this.wsService.onUserVideoStatusChange((userId: string) => {
      this.remoteParticipants.map((participant) => {
        if (participant.participantId === userId) {
          participant.isVideoEnabled = !participant.isVideoEnabled;
          console.log('video', participant.isVideoEnabled);
        }
      });
    });
  }

  // Room control methods
  joinRoom(): void {
    this.isRoomJoined = true;

    this.roomID = this.activeRoute.snapshot.paramMap.get('roomId') || '';
    if (this.roomID) {
      this.wsService.joinRoom(this.roomID);
      this.userRoomServices.updateRoomWithParticipant(this.roomID, this.userId,1);
      this.wsService.updateRoomCountWithParticipant(this.roomID, this.userId);
    }
  }
  

  leaveRoom(): void {
    this.wsService.leaveRoom(this.localStream?.userId || '');
    if (this.localStream?.mediaStream) {
      this.localStream.mediaStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    this.pcService.closeAllConnections();
    this.router.navigate(['/user/roomList']);
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
    if(!this.screenSharing){
      this.pcService.startScreenSharing();
      this.screenSharing = !this.screenSharing
    }else{
      this.pcService.stopScreenSharing();
      this.screenSharing = !this.screenSharing
    }
    
  }



  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(message: string): void {
    this.wsService.sendMessage(message);
    this.messages.push(`You: ${message}`);
  }

  // Rating modal
  openRatingModal(userId: string): void {
    this.getRaterId = userId;
    console.log(this.getRaterId);
    this.showRatingModal = !this.showRatingModal;
  }

  // Friend management
  private updateFriendsList(): void {
    this.userProfileService.requestGetAllFriends(this.userId).subscribe((friends: any) => {
      this.followers = [];
      this.following = [];

      friends.followers.forEach((element: IUser) => {
        this.followers.push(element.id);
      });
      friends.following.forEach((element: IUser) => {
        this.following.push(element.id);
      });

      console.log('Updated followers:', this.followers);
      console.log('Updated following:', this.following);
    });
  }

  followUser(friendId: string): void {
    const userId = JSON.parse(localStorage.getItem('userData') || '{}').id;
    console.log('userId', userId, 'getRaterId', this.getRaterId);
    this.userProfileService.requestFollowUnFollow(userId, friendId).subscribe(() => {
      this.updateFriendsList();
    });
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
    console.log(this.reportUserId);
  }

  
}
