import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../models/member.model';
import { UserProfileService } from '../../../core/services/user/user-profile.service';
import { FriendChatService } from '../../../core/services/friend-chat.service';
import { IChat, IMessage } from '../../models/chat-message.model';
import { WsService } from '../../../core/services/ws.service';

@Component({
  selector: 'app-chating-page',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chating-page.component.html',
  styleUrl: './chating-page.component.css'
})
export class ChatingPageComponent implements OnInit ,AfterViewChecked  {
  @Output() GoBack = new EventEmitter<void>();
  @Input() Chat: IChat | null = null;
  status: string = '';
  myMessage:{time:Date,message:string}[]=[]
  newMessage: string = '';
  messages!: IMessage;
  userId = JSON.parse(localStorage.getItem('userData') || '{}').id
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  friendChatServices = inject(FriendChatService);
  wsService = inject(WsService);

  ngOnInit() {
    this.wsService.joinPrivateChat(this.Chat?.id||'');
    this.wsService.onPrivateMessage().subscribe((message: IMessage) => {
      this.Chat?.messages?.push(message);
    })
  this.wsService.onFriendStatus().subscribe((status: string) => {
    this.status = status;
  })

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error while scrolling:', err);
    }
  }
  sendMessage() {
    
    this.messages = {
      content: this.newMessage,
      senderId: this.userId,
      chatId: this.Chat?.id||'',
      createdAt: new Date()
    }
    this.Chat?.messages?.push(this.messages);
    this.newMessage = '';
    this.wsService.sendPrivateMessage(this.messages);

    this.friendChatServices.requestSendMessage(this.messages).subscribe((res) => {
      console.log(res.message);
    });
    
  }


  goBack() {
    // Implement navigation back to friend list or previous view
    this.GoBack.emit();
    const lastTime = `Last seen ${new Date()}`;
    this.wsService.leavePrivateChat(this.Chat?.id||'',lastTime);
  }



}
