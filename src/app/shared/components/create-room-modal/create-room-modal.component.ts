import { Component, EventEmitter, Output } from '@angular/core';
import { FormField } from '../../models/form-field.interface';
import { CreateRoomField } from '../../FieldConfigs/CreateRoomField';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-room-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './create-room-modal.component.html',
  styleUrl: './create-room-modal.component.css',
})
export class CreateRoomModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
  groupForm!: FormGroup;
  maxPeopleOptions = [5, 10, 20, 50];
  levelOptions = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      topic: ['', Validators.required],
      maxPeople: ['unlimited'],
      language: ['',Validators.required   ],
      level: ['BEGINNER'],
    });
  }
// In your component.ts file
isSubmitting = false;

onSubmit() {
  console.log("Form Submitted");
  if (this.groupForm.valid && !this.isSubmitting) {
    this.isSubmitting = true;
   this.submit.emit(this.groupForm.value);
  }
}

  onCancel() {
    this.closeModal.emit();
  }
}
