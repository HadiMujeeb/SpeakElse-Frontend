import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  NgModule,
  OnInit,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { HeaderComponent } from '../../../shared/layouts/header/header.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { RoomCardComponent } from '../../../shared/components/room-card/room-card.component';
import { SearchbarComponent } from '../../../shared/components/searchbar/searchbar.component';
import { CreateRoomModalComponent } from '../../../shared/components/create-room-modal/create-room-modal.component';
import { IrequestCreateRoom, IRoom } from '../../../shared/models/room.model';
import { RoomService } from '../../../core/services/user/room.service';
// models/filter.model.ts
@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FilterComponent,
    RoomCardComponent,
    SearchbarComponent,
    CreateRoomModalComponent,
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css',
})
export class RoomListComponent implements OnInit {
  userRoomServices = inject(RoomService);
  rooms: IRoom[] = [];
  filteredRooms: IRoom[] = [];
  isModelOpen = false;
  appliedFilters = {};
  openModal() {
    this.isModelOpen = true;
  }
  closeModal() {
    this.isModelOpen = false;
  }

  applyFilters(filters: any) {
    this.appliedFilters = filters;
  }

  joinRoom(roomId: string) {
    console.log('Joining room with ID:', roomId);
  }

  ngOnInit(): void {}

  submitRoom(data: IRoom) {
    this.closeModal();
  }
}
