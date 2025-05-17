import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../models/member.model';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { FriendChatService } from '../../../core/services/friend-chat.service';
import { IChat, IMessage } from '../../models/chat-message.model';
import { WsService } from '../../../core/services/ws.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @Output() close = new EventEmitter<void>();
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  // Tabs
  activeTab: 'friends' | 'chats' = 'friends';
  selectedList: 'followers' | 'following' = 'followers';
  searchQuery: string = '';
  isOpen: boolean = true;

  // User Info
  userId = JSON.parse(localStorage.getItem('userData') || '{}').id;
  friends: IUser[] = [];
  filteredFriends: IUser[] = [];
  followers: IUser[] = [];
  following: IUser[] = [];

  // Chat Info
  chats: IChat[] = [];
  filteredChats: IChat[] = [];
  currentChat: IChat | null = null;
  newMessage: string = '';
  status: string = '';

  // Services
  userProfileServices = inject(UserProfileService);
  friendChatServices = inject(FriendChatService);
  wsService = inject(WsService);

  ngOnInit(): void {
    this.loadFriends();
    this.loadChats();

    // Subscribe to subject for friend status updates
    this.wsService.onFriendStatus().subscribe((status: string) => {
      console.log('Status update received:', status);
      this.status = status;
    });

    // Subscribe to subject for private chat messages
    this.wsService.onPrivateMessage().subscribe((message: IMessage) => {
      console.log('Private message received:', message);
      if (this.currentChat && message.chatId === this.currentChat.id) {
        this.currentChat.messages = this.currentChat.messages || [];
        this.currentChat.messages.push(message);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private loadFriends() {
    this.userProfileServices.requestGetAllFriends(this.userId).subscribe({
      next: (friends: any) => {
        this.followers = friends.followers || [];
        this.following = friends.following || [];
        this.selectList('followers');
      },
      error: (error) => console.error('Error fetching friends:', error),
    });
  }

  private loadChats() {
    this.friendChatServices.requestGetAllChat(this.userId).subscribe({
      next: (chats: any) => {
        const seen = new Set();
        this.chats = (chats.chats || []).filter((chat: IChat) => {
          const key = chat.friend?.id;
          if (key && !seen.has(key)) {
            seen.add(key);
            return true;
          }
          return false;
        });
        this.filteredChats = [...this.chats];
      },
      error: (error) => console.error('Error fetching chats:', error),
    });
  }

  onSearch() {
    if (this.activeTab === 'friends') {
      const source = this.selectedList === 'followers' ? this.followers : this.following;
      this.filteredFriends = source.filter((friend) =>
        friend.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else if (this.activeTab === 'chats') {
      this.filteredChats = this.chats.filter((chat) =>
        chat.friend?.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  setActiveTab(tab: 'friends' | 'chats') {
    this.activeTab = tab;
    this.searchQuery = '';
    if (tab === 'friends') {
      this.selectList(this.selectedList);
    } else {
      this.filteredChats = [...this.chats];
    }
  }

  selectList(list: 'followers' | 'following') {
    this.selectedList = list;
    this.filteredFriends = list === 'followers' ? [...this.followers] : [...this.following];
    this.onSearch();
  }

  openChat(friendId: string) {
    if (!friendId) return;

    let existingChat = this.chats.find((chat) => chat.friend?.id === friendId);
    if (existingChat) {
      this.currentChat = existingChat;
      this.wsService.joinPrivateChat(this.currentChat.id);
    } else {
      this.friendChatServices.requestCreateChat(this.userId, friendId).subscribe({
        next: (response: any) => {
          const newChat = response.chat;
          if (!this.chats.some((chat) => chat.friend?.id === newChat.friend?.id)) {
            this.chats.push(newChat);
            this.filteredChats = [...this.chats];
          }
          this.currentChat = newChat;
          this.wsService.joinPrivateChat(newChat.id);
        },
        error: (error) => console.error('Error creating chat:', error),
      });
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentChat) return;

    const message: IMessage = {
      content: this.newMessage,
      senderId: this.userId,
      chatId: this.currentChat.id,
      createdAt: new Date(),
    };

    this.currentChat.messages = this.currentChat.messages || [];
    this.currentChat.messages.push(message);
    this.newMessage = '';

    this.wsService.sendPrivateMessage(message);
    this.friendChatServices.requestSendMessage(message).subscribe({
      next: (res) => console.log(res.message),
      error: (err) => console.error('Error sending message:', err),
    });
  }

  closeChat() {
    if (this.currentChat) {
      const lastTime = `Last seen ${new Date()}`;
      this.wsService.leavePrivateChat(this.currentChat.id, lastTime);
    }
    this.currentChat = null;
  }

  closeModal() {
    this.closeChat();
    this.isOpen = false;
    setTimeout(() => this.close.emit(), 300);
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
