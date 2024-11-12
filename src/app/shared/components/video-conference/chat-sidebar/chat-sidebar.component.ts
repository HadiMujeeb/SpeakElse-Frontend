import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatMessage } from '../../../models/chat-message.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.css'
})
export class ChatSidebarComponent {
  @Input() messages: string[] = [];
  @Output() onSendMessage = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  message: string = '';

  sendMessage(): void {
    console.log('message', this.message);
    if (this.message.trim()) {
      this.onSendMessage.emit(this.message);
      this.message = '';
    }
  }
}
