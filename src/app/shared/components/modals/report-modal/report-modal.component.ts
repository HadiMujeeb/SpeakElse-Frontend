import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfileService } from '../../../../core/services/user/user-profile.service';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.css'
})
export class ReportModalComponent {
  reportForm: FormGroup;
  @Input() reportId: string = '';
  @Output() close = new EventEmitter<void>();
  userProfileServices = inject(UserProfileService);
  userId = JSON.parse(localStorage.getItem('userData') || '{}').id;
  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      reportContent: ['', [Validators.required, Validators.minLength(10)]],
      screenshot: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      const formData: FormData = new FormData();

      formData.append('content', this.reportForm.get('reportContent')?.value);
      formData.append('proof', this.reportForm.get('screenshot')?.value);
      formData.append('reportedId', this.reportId);
      formData.append('reporterId', this.userId);

      this.userProfileServices.requestReportUser(formData).subscribe(
        (response) => {
          console.log(response);
          this.closeModal();
        }
      )
     

    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.reportForm.patchValue({
        screenshot: input.files[0]
      });
    }
  }
  closeModal() {
    this.close.emit();
  }
}
