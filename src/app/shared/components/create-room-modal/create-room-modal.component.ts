import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormField } from '../../models/form-field.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IrequestCreateRoom } from '../../models/room.model';
import { RoomService } from '../../../core/services/user/room.service';

@Component({
  selector: 'app-create-room-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-room-modal.component.html',
  styleUrl: './create-room-modal.component.css',
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
      topic: ['', Validators.required],
      maxPeople: ['unlimited'],
      language: ['', Validators.required],
      level: ['BEGINNER'],
    });
  }

  onSubmit() {
    console.log('Form Submitted');
    if (this.groupForm.valid) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const data: IrequestCreateRoom = this.groupForm.value;
      data.creatorId = userData.id;
      this.userRoomServices.requestAddRoom(data).subscribe(
        (response) => {
          console.log("'Room created successfully:", response);
          this.submit.emit(response);
        },
        (error) => {
          console.error('Error creating room:', error);
        }
      );
    }
  }

  onCancel() {
    this.closeModal.emit();
  }
}
