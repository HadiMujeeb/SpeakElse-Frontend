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
export class RoomCardComponent implements OnInit {
  rooms: IRoom[] = [];
  filteredRooms: IRoom[] = [];
  totalPages: number = 1;
  page: number = 1;
  pageSize: number = 6;
  totalRooms: number = 0;

  filters: any = {};
  @Output() joinRoom = new EventEmitter<any>();

  router = inject(Router);
  userRoomServices = inject(RoomService);

  ngOnInit(): void {
    this.fetchRooms();

    this.userRoomServices.filters$.subscribe((filters) => {
      if (filters) {
        this.filters = filters;
        this.applyFilters();
      }
    });

    this.userRoomServices.createRoom$.subscribe((rooms: IRoom) => {
      this.rooms.push(rooms);
      this.sortRooms();
      this.applyFilters();
    });
  }


  fetchRooms(): void {
   this.userRoomServices.requestGetAllRooms(this.page, this.pageSize).subscribe((response) => {
     this.rooms = response.rooms
     this.totalPages = response.totalPages
     this.totalRooms = response.total
     this.sortRooms();
     this.filteredRooms = [...this.rooms];
     this.applyFilters();
     this.userRoomServices.sendRooms(this.rooms);
     console.log(this.totalPages,this.totalRooms);

   })
  }

  sortRooms(): void {
   this.rooms = this.rooms.sort((a: IRoom, b: IRoom) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
  }

  onJoinRoom(id: string): void {
    this.router.navigate([`/user/room/${id}`]);
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

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}
previousPage(){
  if(this.page > 1){
    this.page--
    this.fetchRooms()
  }
 
}
nextPage(){
  if(this.page < this.totalPages){
    this.page++
    this.fetchRooms()
  }
 
}
}
