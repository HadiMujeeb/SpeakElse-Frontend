import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IrequestCreateRoom, IUserCreatedRoom } from '../../../models/room.model';
import { RoomService } from '../../../../core/services/user/room.service';
import { noWhitespaceValidator } from '../../../utilitys/whiteSpaceValidate';
import { WsService } from '../../../../core/services/ws.service';
@Component({
  selector: 'app-create-room-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-room-modal.component.html',
  styleUrls: ['./create-room-modal.component.css'],
})
export class CreateRoomModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
  groupForm!: FormGroup;
  maxPeopleOptions = [1, 2, 3, 4, 5, 6];
  levelOptions = ['beginner', 'intermediate', 'advanced'];
  privacyOptions = ['PUBLIC', 'PRIVATE']; // Added privacy options
  isSubmitting = false;

  userRoomServices = inject(RoomService);
  wsServices = inject(WsService);
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      topic: ['', [Validators.required, noWhitespaceValidator]],
      maxPeople: ['1'],
      language: ['', [Validators.required, noWhitespaceValidator]],
      level: ['BEGINNER'],
      privacy: ['PUBLIC'], // Default to PUBLIC
    });
  }

  onSubmit() {
    if (this.groupForm.valid) {
      this.isSubmitting = true;
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const data: IrequestCreateRoom = {
        ...this.groupForm.value,
        creatorId: userData.id,
      };

      this.userRoomServices.requestAddRoom(data).subscribe({
        next: (response) => {
          this.userRoomServices.sendCreateRoom(response.room);
          // this.submit.emit(response);
          this.isSubmitting = false;
          this.closeModal.emit();
          this.wsServices.broadcastCreateRoom(response.room);
          this.wsServices.addRoomtoBackend(response.room)
        },
        error: (error) => {
          console.error('Error creating room:', error);
          this.isSubmitting = false;
        },
      });
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.closeModal.emit();
  }
}