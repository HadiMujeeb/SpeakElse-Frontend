import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MentorauthService } from '../../../core/services/mentor/mentorauth.service';
import { Router } from '@angular/router';
import { NavLogoComponent } from '../../../layouts/user/nav-logo/nav-logo.component';

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
  selectedAvatar: File | null = null; 
  avatarInvalid: boolean = false;
  resumeInvalid: boolean = false;
  private authMentorService = inject(MentorauthService);
  userData = JSON.parse(localStorage.getItem('userData') || '{}');
  private router = inject(Router);
  
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.applicationForm = this.formBuilder.group({
      name: [this.userData.name, [Validators.required]],
      email: [this.userData.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar: [''],
      country: ['', [Validators.required]],
      language: ['', [Validators.required]],
      description: ['', [Validators.required]],
      mentorRole: ['', [Validators.required]],
      resume: [''],
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

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (allowedTypes.includes(file.type)) {
        this.selectedAvatar = file;
      } else {
        alert('Only PNG, JPEG, or JPG formats are allowed for avatars');
        event.target.value = '';
        this.selectedAvatar = null;
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.applicationForm.invalid) {
      console.log('Invalid form');
      return;
    }
    console.log(this.applicationForm.value);

    const formData = new FormData();
    Object.keys(this.applicationForm.value).forEach((key) => {
      formData.append(key, this.applicationForm.value[key]);
    });
    formData.append('userId', this.userData.id);

    if (this.selectedFile) {
      formData.append('resume', this.selectedFile, this.selectedFile.name);
    }

        if (this.selectedAvatar) {
          formData.append('avatar', this.selectedAvatar, this.selectedAvatar.name);
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
  }

  private resetForm() {
    this.applicationForm.reset();
    this.submitted = false;
    this.selectedFile = null;
    this.selectedAvatar = null;
  }
}
