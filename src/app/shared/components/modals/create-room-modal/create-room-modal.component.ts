import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IrequestCreateRoom } from '../../../models/room.model';
import { RoomService } from '../../../../core/services/user/room.service';
import { noWhitespaceValidator } from '../../../utilitys/whiteSpaceValidate';

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
  maxPeopleOptions = [5, 10, 20, 50];
  levelOptions = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  userRoomServices = inject(RoomService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      topic: ['', [Validators.required, noWhitespaceValidator]],
      maxPeople: ['unlimited'],
      language: ['', [Validators.required, noWhitespaceValidator]],
      level: ['BEGINNER'],
    });
  }

  onSubmit() {
    if (this.groupForm.valid) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const data: IrequestCreateRoom = {
        ...this.groupForm.value,
        creatorId: userData.id,
      };

      this.userRoomServices.requestAddRoom(data).subscribe(
        (response: any) => {

          this.userRoomServices.sendCreateRoom(response.room);

          this.submit.emit(response); // Emit the response to the parent component
        },
        (error) => {
          console.error('Error creating room:', error);
        }
      );
    } else {
      this.groupForm.markAllAsTouched(); // Highlight all invalid fields
    }
  }

  onCancel() {
    this.closeModal.emit(); // Emit close event
  }
}
