import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule],  // Import NgbModalModule
  providers: [NgbActiveModal],  // Ensure NgbActiveModal is provided
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent {
  
  memberForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,  // NgbActiveModal injected here
    private fb: FormBuilder
  ) {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  saveMemberData() {
    if (this.memberForm.valid) {
      const updatedMemberData = this.memberForm.value;
      console.log('Member data saved:', updatedMemberData);
      this.activeModal.close(updatedMemberData);  // Close modal with updated data
    } else {
      console.error('Form is invalid');
    }
  }

}
