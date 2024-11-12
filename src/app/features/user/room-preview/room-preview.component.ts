import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavLogoComponent } from '../../../layouts/nav-logo/nav-logo.component';
import { PcService } from '../../../core/services/pc.service';
import { WsService } from '../../../core/services/ws.service';
import { ActivatedRoute } from '@angular/router';
interface DeviceOption {
  id: string;
  label: string;
}
@Component({
  selector: 'app-room-preview',
  standalone: true,
  imports: [CommonModule,FormsModule,NavLogoComponent],
  templateUrl: './room-preview.component.html',
  styleUrl: './room-preview.component.css'
})
export class RoomPreviewComponent {
  localStream: MediaStream | null = null;
  isAudioEnabled: boolean = true;  // To keep track of audio state
  isVideoEnabled: boolean = true; 
  noParticipants: boolean = true;
  roomID: string = '';
  userEmail: string = JSON.parse(localStorage.getItem('userData') || '{}').email;
  pcService = inject(PcService);
  wsService = inject(WsService);
  activeRoute = inject(ActivatedRoute);

  @ViewChild('myVideo') myVideoElement!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void {
    this.pcService.initLocalStream();
    this.pcService.localStream$.subscribe((stream) => {
      if (stream) {
        this.localStream = stream;
        this.myVideoElement.nativeElement.srcObject = stream;
        this.myVideoElement.nativeElement.muted = true; 
      }
    });
  }


  toggleAudio(): void {
    if (this.localStream) {
      this.isAudioEnabled = !this.isAudioEnabled;
      this.localStream.getAudioTracks().forEach(track => (track.enabled = this.isAudioEnabled));
    }
  }

  // Toggle video track on/off
  toggleVideo(): void {
    if (this.localStream) {
      this.isVideoEnabled = !this.isVideoEnabled;
      this.localStream.getVideoTracks().forEach(track => (track.enabled = this.isVideoEnabled));
    }
  }
  joinRoom(): void {
    this.roomID = this.activeRoute.snapshot.paramMap.get('roomId') || '';
    if (this.roomID) {
      this.wsService.joinRoom(this.roomID); 
    }
  }

  showOtherJoinOptions(): void {
    // Implement show other options logic
    console.log('Showing other join options...');
  }

}
