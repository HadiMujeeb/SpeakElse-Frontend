import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IRoom } from '../../models/room.model';
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
  rooms: IRoom[] = [];
  @Output() room = new EventEmitter<void>();

  // Emit filters when they change
  @Output() filtersChanged = new EventEmitter<{
    language: string;
    profession: string;
    country: string;
    level: string;
    topic: string;
  }>();

  // Options for each filter field
  languageOptions: { label: string; value: string }[] = [];
  professionOptions: { label: string; value: string }[] = [];
  countryOptions: { label: string; value: string }[] = [];
  levelOptions: { label: string; value: string }[] = [];
  topicOptions: { label: string; value: string }[] = [];

  userRoomServices = inject(RoomService);

  // Separate filters for each field
  filters = {
    language: '',
    profession: '',
    country: '',
    level: '',
    topic: '',
  };

  constructor() {}

  ngOnInit(): void {
    this.userRoomServices.room$.subscribe((rooms) => {
      this.rooms = rooms;
      this.populateFilterOptions();
    });
  }

  populateFilterOptions(): void {
    this.languageOptions = [
      ...new Set(this.rooms.map((room) => room.language)),
    ].map((language) => ({ label: language, value: language }));

    this.levelOptions = [...new Set(this.rooms.map((room) => room.level))].map(
      (level) => ({ label: level, value: level })
    );

    this.topicOptions = [...new Set(this.rooms.map((room) => room.topic))].map(
      (topic) => ({ label: topic, value: topic })
    );
  }

  applyFilters(): void {
    this.filtersChanged.emit(this.filters);
  }

  clearFilter(fieldName: string): void {
    // this.filters[fieldName] = '';
    this.applyFilters();
  }

  createRoom(): void {
    this.room.emit();
  }
}
