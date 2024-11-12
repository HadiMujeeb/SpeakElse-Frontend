import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { HeaderComponent } from '../../../layouts/header/header.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { RoomCardComponent } from '../../../shared/components/room-card/room-card.component';
import { SearchbarComponent } from '../../../shared/components/searchbar/searchbar.component';
import { CreateRoomModalComponent } from '../../../shared/components/create-room-modal/create-room-modal.component';
import { IrequestCreateRoom, IRoom } from '../../../shared/models/room.interface';
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

  userRoomServices =  inject(RoomService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  rooms:IRoom[] = []
  filteredRooms: IRoom[] = [];
  isModelOpen = false;
  openModal() {
    this.isModelOpen = true;
  }
  closeModal() {
    this.isModelOpen = false;
  }
  submitRoom(credentials: any) {
    console.log("working man")
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const data:IrequestCreateRoom = credentials;
    data.creatorId = userData.id;
    this.userRoomServices.requestAddRoom(data).subscribe(
      (response) => {
        this.rooms = [...this.rooms, response.room];
        this.filteredRooms = [...this.rooms];
        this.cdr.detectChanges();
        this.closeModal();
      },
      (error) => {
        console.log(error, 'errorefwewibwidwbecdi');
      }
    )
    
  }
 
  applyFilters() {
    this.filteredRooms = this.rooms; 
  }

  joinRoom(roomId: string) {
    console.log('Joining room with ID:', roomId);
  }

  ngOnInit(): void {
    this.userRoomServices.requestGetAllRooms().subscribe(
      (response) =>{
        this.rooms = response;
        this.filteredRooms = [...this.rooms];
      },
    (error) =>{
      console.error(error);
    }
    )
  }
}
