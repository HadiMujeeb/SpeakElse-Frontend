import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
interface Message {
  sender: string;
  content: string;
  time: string;
}

@Component({
  selector: 'app-roominterface',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './roominterface.component.html',
  styleUrl: './roominterface.component.css'
})
export class RoominterfaceComponent {
  @Input() isOpen: boolean = true;
  @Output() onClose = new EventEmitter<void>();

  allowMessages: boolean = true;
  newMessage: string = '';
  messages: Message[] = [];

  toggleMessages(): void {
    this.allowMessages = !this.allowMessages;
  }

  closeChat(): void {
    this.onClose.emit();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        sender: 'You',
        content: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.newMessage = '';
    }
  }
}
