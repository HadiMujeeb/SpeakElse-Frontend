import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { WebrtcService } from '../../../core/services/user/webrtc.service';

@Component({
  selector: 'app-roominterface',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './roominterface.component.html',
  styleUrl: './roominterface.component.css'
})
export class RoominterfaceComponent  implements AfterViewInit{

  @ViewChild('localVideo') localVideoRef!:ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideoRef!:ElementRef<HTMLVideoElement>;

  constructor(private webrtcService:WebrtcService) {}

  ngAfterViewInit(): void {
    this.webrtcService.getLocalStream().then(localStream => {
      this.localVideoRef.nativeElement.srcObject = localStream;
    }).catch(error => {
      console.error('Error accessing local stream', error);
    });
  }
}
