import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IRoom } from '../../models/room.model';
import { Router } from '@angular/router';
import { RoomService } from '../../../core/services/user/room.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.css'],
})
export class RoomCardComponent implements OnInit, OnChanges {
  rooms: IRoom[] = [];
  filteredRooms: IRoom[] = [];

  @Input() filters: any;
  @Output() joinRoom = new EventEmitter<any>();

  router = inject(Router);
  userRoomServices = inject(RoomService);

  ngOnInit(): void {
    this.fetchRooms();
  }

  fetchRooms(): void {
    this.userRoomServices.requestGetAllRooms().subscribe(
      (response) => {
        this.rooms = response.sort(
          (a: IRoom, b: IRoom) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filteredRooms = [...this.rooms];
        this.applyFilters();
        this.userRoomServices.sendRooms(this.rooms);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onJoinRoom(id: string): void {
    this.router.navigate([`/user/room/${id}`]);
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRooms = this.rooms.filter((room) => {
      return (
        (!this.filters.language || room.language === this.filters.language) &&
        (!this.filters.profession ||
          room.creator.profession === this.filters.profession) &&
        (!this.filters.country ||
          room.creator.country === this.filters.country) &&
        (!this.filters.level || room.level === this.filters.level) &&
        (!this.filters.topic || room.topic === this.filters.topic)
      );
    });
  }
}
