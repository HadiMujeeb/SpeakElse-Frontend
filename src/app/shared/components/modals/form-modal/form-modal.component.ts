import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormField } from '../../../models/form-field.model';
import { ModalAction } from '../../../models/modal-action.enum';
@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
})
export class FormModalComponent {
  memberForm: FormGroup;
  @Input() ActionType!: ModalAction;
  @Input() fields: FormField[] = [];
  @Input() member: any;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
  @Output() AddMember = new EventEmitter<any>();
  @Output() EditUserProfile = new EventEmitter<any>();
  @Output() EditMentorProfile = new EventEmitter<any>();
  action:string=''
  selectedFile: File | null = null;
  constructor(private fb: FormBuilder) {
    this.memberForm = this.fb.group({});
  }

  ngOnInit() {
    this.initForm();
    this.formHeader();
  }

 initForm() {
  this.fields.forEach((field) => {
    let value = '';

    if (this.member &&this.member[field.name] !== 'null') {
      value = this.member[field.name];
    }

    const control = this.fb.control(
      value,
      field.errors ? Validators.required : null
    );
    this.memberForm.addControl(field.name, control);
  });
}

  formHeader(){
    if(this.ActionType==ModalAction.AddMember){
     this.action = "ADD Member"
    }else if(this.ActionType==ModalAction.EditMember){
      this.action = "Edit Member"
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    // if (this.memberForm.valid) {
    const formData = this.memberForm.value;
    if (this.ActionType === ModalAction.AddMember) {
      this.AddMember.emit({ data: formData, file: this.selectedFile });
    } else if (this.ActionType === ModalAction.EditMentor) {
      this.EditMentorProfile.emit({ data: formData, file: this.selectedFile });
    } else if (this.ActionType === ModalAction.EditUser) {
      this.EditUserProfile.emit({ data: formData, file: this.selectedFile });
    } else if (this.ActionType === ModalAction.EditMember) {
      this.submit.emit({ data: formData, file: this.selectedFile });
    }
    // }
  }

  onClose() {
    this.close.emit();
  }
}
