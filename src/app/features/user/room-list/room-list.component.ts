import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { HeaderComponent } from '../../../layouts/header/header.component';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { RoomCardComponent } from '../../../shared/components/room-card/room-card.component';
import { SearchbarComponent } from '../../../shared/components/searchbar/searchbar.component';
export interface Room {
  id: string;
  hostName: string;
  hostCountry: string;
  language: string;
  level: string;
  profession: string;
  topic: string;
  rating: number;
  limit: number;
  profileImage: string;
}

// models/filter.model.ts
export interface RoomFilter {
  language?: string;
  profession?: string;
  country?: string;
  level?: string;
  topic?: string;
  searchText?: string;
}
@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent,FilterComponent,RoomCardComponent,SearchbarComponent],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit{
  rooms = [
    {
      id: 1,
      hostName: 'John Doe',
      hostCountry: 'US',
      profileImage: 'path/to/image1.jpg',
      limit: 10,
      rating: 4.5,
      participants: 5,  // Number of participants
      topic: 'Web Development',  // Topic of the room
      userProfession: 'Software Engineer',  // User profession
      description: 'Join us to discuss the latest trends and technologies in web development.'  // Optional description
    },
    {
      id: 2,
      hostName: 'Jane Smith',
      hostCountry: 'CA',
      profileImage: 'path/to/image2.jpg',
      limit: 8,
      rating: 4.7,
      participants: 3,
      topic: 'Digital Marketing',
      userProfession: 'Marketing Specialist',
      description: 'Explore effective strategies for digital marketing and how to engage audiences online.'  // Optional description
    },
    {
      id: 1,
      hostName: 'John Doe',
      hostCountry: 'US',
      profileImage: 'path/to/image1.jpg',
      limit: 10,
      rating: 4.5,
      participants: 5,
      topic: 'Web Development',
      userProfession: 'Software Engineer',
      language: 'English'  // Specify the language
    }
    
    // Add more rooms as needed
  ];
  

  // Initialize filtered rooms
  filteredRooms = [...this.rooms];

  // Apply filters (or reset to all rooms)
  applyFilters() {
    // Logic to filter rooms
    this.filteredRooms = this.rooms;  // Replace with actual filtering logic
  }

  // Handle room join event
  joinRoom(roomId: number) {
    console.log('Joining room with ID:', roomId);
    // Add your logic for handling the join action here
  }
  ngOnInit(): void {
    
  }
}