import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IRoom } from '../../models/room.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {
  @Input() room!: IRoom;
  @Output() joinRoom = new EventEmitter<any>();
router = inject(Router)
 
  onJoinRoom(id:string) {
    this.router.navigate([`/user/room/${id}`])
  }
}
