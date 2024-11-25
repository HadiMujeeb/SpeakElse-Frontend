import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { IUser } from '../../models/member.model';
interface Friend {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  canCall: boolean;
}
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent  implements OnInit{
  @Output() close = new EventEmitter<void>();
  activeTab: string = 'friends'; // Current tab ('friends' or 'chats')
  activeFilter: string = 'all'; // Current filter for friends list
  searchQuery: string = '';
  chatSearchQuery: string = '';
   userProfileServices = inject(UserProfileService);
   userId = JSON.parse(localStorage.getItem('userData') || '{}').id
  friends:IUser[] = [];

  chats = [
    { name: 'Alice', avatar: 'path/to/avatar1.jpg', lastMessage: 'Hey there!' },
    { name: 'Bob', avatar: 'path/to/avatar2.jpg', lastMessage: 'What’s up?' },
  ];
 following: IUser[] = [];
 followers: IUser[] = [];
  filteredFriends: IUser[] = [];
  filteredChats = [...this.chats];


  ngOnInit(): void {
    this.userProfileServices.requestGetAllFriends(this.userId).subscribe((friends:any) => {
      this.followers = friends.followers;
      this.following = friends.following;
      this.filteredFriends = [...this.followers, ...this.following];
    })
    
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    if(filter === 'all'){ 
   this.filteredFriends = [...this.followers, ...this.following];
  }else if(filter === 'followers'){
    this.filteredFriends = [...this.followers];
    
  }else if(filter === 'following'){
    this.filteredFriends = [...this.following];
  }
    // this.activeFilter = filter;
}

  onSearch() {
    this.filteredFriends = this.friends.filter((friend) =>
      friend.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onChatSearch() {
    this.filteredChats = this.chats.filter((chat) =>
      chat.name.toLowerCase().includes(this.chatSearchQuery.toLowerCase())
    );
  }

  closeModal() {
    this.close.emit();
  }
}
