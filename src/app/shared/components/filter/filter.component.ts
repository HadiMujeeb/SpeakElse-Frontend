import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IRoom, IUserCreatedRoom } from '../../models/room.model';
import { RoomService } from '../../../core/services/user/room.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  rooms: IUserCreatedRoom[] = [];
  
  @Output() room = new EventEmitter<void>();
  @Output() openModal = new EventEmitter<void>();
  // Emit filters when they change
  @Output() filtersChanged = new EventEmitter<{
    language: string;
    level: string;
    country: string;
    topic: string;
    availability: string;
    search: string;
  }>();

  // Options for each filter field
  languageOptions: { label: string; value: string }[] = [];
  levelOptions: { label: string; value: string }[] = [
    // { label: 'Beginner', value: 'beginner' },
    // { label: 'Intermediate', value: 'intermediate' },
    // { label: 'Advanced', value: 'advanced' },
  ];
  countryOptions: { label: string; value: string }[] = [];
  topicOptions: { label: string; value: string }[] = [];
  availabilityOptions: { label: string; value: string }[] = [
    { label: 'Online Now', value: 'online' },
    { label: 'All Users', value: 'all' },
  ];

  userRoomServices = inject(RoomService);

  // Filters for each field
  filters = {
    language: '',
    level: '',
    country: '',
    topic: '',
    availability: '',
    search: '',
  };

  constructor() {}

  ngOnInit(): void {
    // Subscribe to the room service to get rooms data
    this.userRoomServices.room$.subscribe((rooms) => {
      this.rooms = rooms;
      this.populateFilterOptions();
    });
  }

  populateFilterOptions(): void {
    this.languageOptions = [
      ...new Set(this.rooms.map((room) => room.language).filter((lang) => lang !== undefined)),
    ].map((language) => ({ label: language as string, value: language as string }));

    this.countryOptions = [
      ...new Set(this.rooms.map((room) => room?.creator?.country).filter((country) => country !== undefined)),
    ].map((country) => ({ label: country as string, value: country as string }));
    this.topicOptions = [
      ...new Set(this.rooms.map((room) => room.topic).filter((topic) => topic !== undefined)),
    ].map((topic) => ({ label: topic as string, value: topic as string }));
    this.levelOptions = [
      ...new Set(this.rooms.map((room) => room.level).filter((level) => level !== undefined)),
    ].map((level) => ({ label: level as string, value: level as string }));
  }

  applyFilters(): void {
    this.filtersChanged.emit(this.filters);
    this.userRoomServices.updateFilters(this.filters);
  }

  clearFilter(fieldName: keyof typeof this.filters): void {
    this.filters[fieldName] = '';
    this.applyFilters();
  }

  createRoom(): void {
    // Emit an event to create a new room
    this.room.emit();
  }

  openChatModal(): void {
    // Emit an event to open the chat modal
    this.openModal.emit();
  }
}
