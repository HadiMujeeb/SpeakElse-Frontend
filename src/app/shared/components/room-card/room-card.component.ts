import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule,ButtonComponent],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {
  @Input() room: any;
  @Output() joinRoom = new EventEmitter<number>();

  // Emit the room ID when the "Join" button is clicked
  joinRoomHandler() {
    this.joinRoom.emit(this.room.id);
  }
}
