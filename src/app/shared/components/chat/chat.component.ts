import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { IUser } from '../../models/member.model';
import { ChatingPageComponent } from '../chating-page/chating-page.component';
import { FriendChatService } from '../../../core/services/friend-chat.service';
import { IChat } from '../../models/chat-message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatingPageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  activeTab: string = 'friends';
  searchQuery: string = '';
  selectedFriend: IUser | null = null; 
  userProfileServices = inject(UserProfileService);
  userId = JSON.parse(localStorage.getItem('userData') || '{}').id;
  friends: IUser[] = [];
  filteredFriends: IUser[] = [];
  FriendsChats: IChat[] = [];
  Chat: IChat|null = null;
  selectedList='followers'
  followers: IUser[] = [];
  following: IUser[] = [];
  friendChatServices = inject(FriendChatService)
  ngOnInit(): void {
    this.userProfileServices.requestGetAllFriends(this.userId).subscribe((friends: any) => {
      this.followers = friends.followers;
      this.following = friends.following;
    });
  
    this.friendChatServices.requestGetAllChat(this.userId).subscribe((chats: any) => {
      this.FriendsChats = chats.chats
      console.log(this.FriendsChats);
    });

  }

  onSearch() {
    this.filteredFriends = this.friends.filter((friend) =>
      friend.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  setActiveTab(tab: string) {
    if ( tab==='chats') {
    this.activeTab = tab;
  }else if (tab === 'friends') {
    this.activeTab = tab;
  }
  }


  openChat(friendId: string) {
    const chat=this.FriendsChats.find((chat) => chat.friend?.id === friendId)??null
    if (chat) {
     this.Chat = chat
    } else {
      this.friendChatServices.requestCreateChat(this.userId, friendId).subscribe((chat: any) => {
        this.Chat = chat.chat
      });
    }
}

  closeChat() {
    this.Chat = null
  }

  closeModal() {
    this.close.emit();
  }

  selectList(list: string) {
    if(list =="followers"){
      this.selectedList = list;
      this.filteredFriends =[...this.followers]
    }else if(list =="following"){
      this.selectedList = list;
      this.filteredFriends = [...this.following]
    }
   
  }
}
