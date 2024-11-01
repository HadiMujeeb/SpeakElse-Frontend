import { Component } from '@angular/core';
import { FormField } from '../../models/form-field.interface';
import { CreateRoomField } from '../../FieldConfigs/CreateRoomField';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-room-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './create-room-modal.component.html',
  styleUrl: './create-room-modal.component.css'
})
export class CreateRoomModalComponent {

RoomForm!:FormGroup
fields:FormField[] = CreateRoomField


onSubmit(){

}

onClose(){

}

}
