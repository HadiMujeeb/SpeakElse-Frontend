import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { mentorApplicationFields } from '../../../shared/FieldConfigs/mentor-application.fields';
import { MentorauthService } from '../../../core/services/mentor/mentorauth.service';
import { HeaderComponent } from '../../../shared/layouts/header/header.component';
import { NavLogoComponent } from '../../../shared/layouts/nav-logo/nav-logo.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentorapplication',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavLogoComponent],
  templateUrl: './mentorapplication.component.html',
  styleUrls: ['./mentorapplication.component.css'],
})
export class MentorapplicationComponent {
  applicationForm!: FormGroup;
  submitted = false;
  selectedFile: File | null = null;

  authMentorService = inject(MentorauthService);
  router = inject(Router);
  userData = JSON.parse(localStorage.getItem('userData') || '{}');
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.applicationForm = this.formBuilder.group({
      name: [this.userData.name || '', [Validators.required]],
      email: [
        this.userData.email || '',
        [Validators.required, Validators.email],
      ],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      id: [this.userData.id || '', [Validators.required]],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size <= maxSize) {
        this.selectedFile = file;
      } else {
        alert('File size should not exceed 5MB');
        event.target.value = '';
        this.selectedFile = null;
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.applicationForm.invalid) {
      return;
    }
    console.log('Form Submitted', this.applicationForm.value);
    const formData = new FormData();

    Object.keys(this.applicationForm.value).forEach((key) => {
      formData.append(key, this.applicationForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append('resume', this.selectedFile, this.selectedFile.name);
    }
    this.authMentorService.requestRegisterApplicationForm(formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response.message);
        this.router.navigate(['/user/home']);
        this.resetForm();
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );

    this.resetForm();
  }

  private resetForm() {
    this.applicationForm.reset();
    this.submitted = false;
    this.selectedFile = null;
  }
}
