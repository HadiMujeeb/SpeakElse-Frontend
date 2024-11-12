import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';


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


  ngAfterViewInit(): void {

  }
}
