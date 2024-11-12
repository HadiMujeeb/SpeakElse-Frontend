import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participant } from '../../../models/participant.interface'; // Adjust the path as needed

@Component({
  selector: 'app-participant-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participant-video.component.html',
  styleUrls: ['./participant-video.component.css']
})
export class ParticipantVideoComponent implements OnInit {
  
  @Input() localStream!: MediaStream|null; // Local stream input from parent
  @Input() remoteParticipants: Participant[] = []; // Remote participants input from parent
  
  @ViewChild('localVideo') localVideoElement!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void {
    console.log('Local stream:', this.localStream);
    if (this.localVideoElement) {
      this.localVideoElement.nativeElement.srcObject = this.localStream;
    }
  }
}
