import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-control-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-bar.component.html',
  styleUrl: './control-bar.component.css'
})
export class ControlBarComponent {
  @Output() onToggleAudio = new EventEmitter<void>();
  @Output() onToggleVideo = new EventEmitter<void>();
  @Output() onChatToggle = new EventEmitter<void>();
  @Output() onLeaveCall = new EventEmitter<void>();
  @Output() onReaction = new EventEmitter<string>();
  @Output() shareScreen = new EventEmitter<void>()

  @Input() isAudioMuted! : boolean;
  @Input()isVideoEnabled! : boolean;
  isScreenSharing = false;
  isHandRaised = false;
  showEmojiPicker = false;

  reactions = ['👍', '👏', '❤️', '😂', '😮', '🎉'];

  toggleAudio() {
    
    this.isAudioMuted = !this.isAudioMuted;
    this.onToggleAudio.emit();
    // Implement audio toggle logic

  }

  toggleVideo() {
    this.isVideoEnabled = !this.isVideoEnabled;
    this.onToggleVideo.emit();
  }

  toggleScreenShare() {
    this.isScreenSharing = !this.isScreenSharing;
    this.shareScreen.emit();
  }

  toggleHandRaise() {
    this.isHandRaised = !this.isHandRaised;
    // Implement hand raise logic
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  sendReaction(emoji: string) {
    this.onReaction.emit(emoji);
    this.showEmojiPicker = false;
  }

  toggleParticipantsList() {
    // Implement participants list toggle logic
  }

  toggleMoreOptions() {
    // Implement more options menu logic
  }
}
