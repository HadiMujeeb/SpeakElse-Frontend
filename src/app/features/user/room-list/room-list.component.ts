import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../layouts/user/header/header.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { SearchbarComponent } from '../../../shared/components/searchbar/searchbar.component';
import { CreateRoomModalComponent } from '../../../shared/components/modals/create-room-modal/create-room-modal.component';
import { IrequestCreateRoom, IRoom, IUserCreatedRoom, RoomInfo } from '../../../shared/models/room.model';
import { RoomService } from '../../../core/services/user/room.service';
import { ChatComponent } from '../../../shared/components/chat/chat.component';
import { WsService } from '../../../core/services/ws.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FilterComponent,
    SearchbarComponent,
    CreateRoomModalComponent,
    ChatComponent,
  ],
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit {
  rooms: IUserCreatedRoom[] = [];
  filteredRooms: IUserCreatedRoom[] = [];
  filters: any = {};

  isModelOpen = false;
  isChatMOdelOpen = false;

  userRoomServices = inject(RoomService);
  wsServices = inject(WsService);
  router = inject(Router);

  ngOnInit(): void {
    this.fetchRooms();

    this.wsServices.onRoomCreated().subscribe((room: IUserCreatedRoom) => {
      this.rooms.push(room);
      this.filteredRooms = this.sortRooms([...this.rooms]);
    });

    this.userRoomServices.room$.subscribe((rooms: IUserCreatedRoom[]) => {
      this.rooms = rooms;
      this.filteredRooms = this.sortRooms([...this.rooms]);
    });

    this.wsServices.onRoomCountUpdated(({ roomId, participantId, count }) => {
      this.userRoomServices.updateRoomWithParticipant(roomId, participantId, count);
    });

    this.wsServices.getAllRoomsInfo();
    this.wsServices.onRoomsInfo((roomsInfo: RoomInfo[]) => {
      this.updateRoomMemberInfo(roomsInfo);
      this.filteredRooms = this.sortRooms([...this.rooms]);
    });


    this.wsServices.deletedRoom((roomId: string) => {
      this.removeRoom(roomId);
    });
  }

  fetchRooms(): void {
    this.userRoomServices.requestGetAllRooms().subscribe((response) => {
      this.rooms = response.rooms;
      this.userRoomServices.sendRooms(this.rooms);
      this.filteredRooms = this.sortRooms([...this.rooms]);
    });
  }

  sortRooms(rooms: IUserCreatedRoom[]): IUserCreatedRoom[] {
    return rooms.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  onJoinRoom(id: string): void {
    this.router.navigate([`/user/room/${id}`]);
  }

  openModal() {
    this.isModelOpen = true;
  }

  closeModal() {
    this.isModelOpen = false;
  }

  openChatModal() {
    this.isChatMOdelOpen = true;
  }

  closeChatModal() {
    this.isChatMOdelOpen = false;
  }

  joinRoom(roomId: string) {
    this.onJoinRoom(roomId);
  }

  submitRoom(data: IRoom) {
    this.closeModal();
  }

 
  removeRoom(roomId: string): void {
    this.rooms = this.rooms.filter((room) => room.id !== roomId);
    this.filteredRooms = this.filteredRooms.filter((room) => room.id !== roomId);
  }

  onFiltersChanged(filters: any): void {
    this.filters = filters;
    this.applyFilters();
  }

  // Apply filters to rooms
  applyFilters(): void {
    this.filteredRooms = this.rooms.filter((room) => {
      const matchesLanguage =
        !this.filters.language || room.language === this.filters.language;

      const matchesLevel =
        !this.filters.level || room.level === this.filters.level;

      const matchesCountry =
        !this.filters.country ||
        (room.creator?.country && room.creator.country === this.filters.country);

      const matchesTopic =
        !this.filters.topic || room.topic === this.filters.topic;

      return (
        matchesLanguage &&
        matchesLevel &&
        matchesCountry &&
        matchesTopic
      );
    });

    this.filteredRooms = this.sortRooms(this.filteredRooms);
  }

  updateRoomMemberInfo(roomsInfo: RoomInfo[]): void {
    roomsInfo.forEach((info) => {
      const room = this.rooms.find((r) => r.id === info.roomId);
      if (room) {
        room.peopleCount.joined = info.memberCount;
        room.participants = info.members;
      }
    });
    this.filteredRooms = [...this.rooms];
  }
}
