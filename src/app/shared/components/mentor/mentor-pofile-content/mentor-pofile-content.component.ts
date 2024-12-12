import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from '../../../../core/services/user/user-profile.service';
import { MentorProfileService } from '../../../../core/services/mentor/mentor-profile.service';
import { IApplication } from '../../../models/mentorform.model';
import { IComment } from '../../../models/friendsRating.model';

@Component({
  selector: 'app-mentor-pofile-content',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mentor-pofile-content.component.html',
  styleUrls: ['./mentor-pofile-content.component.css'],
})
export class MentorPofileContentComponent {
  profile = {
    name: 'Tonmoy Karmoker',
    job: 'Web Designer',
    rating: 4.9,
    reviews: 131,
    hourlyRate: 15,
    location: 'Bangladesh',
    skills: ['User Interface (UI)', 'Adobe XD', 'UI/UX', 'HTML', 'CSS'],
    description: 'Lorem ipsum dolor sit amet...',
  };

  portfolio = [
    { title: 'Landing Page Design', number: '01' },
    { title: 'Website Page Design', number: '02' },
  ];

  reviews:IComment[] = [];

  mentor: IApplication | null = null;
  mentorForm: FormGroup;
  isEditModalOpen = false;
  isProfileModalOpen = false;
  avatarPreview: string | ArrayBuffer | null = null; // Added to resolve the error
  userProfileServices = inject(UserProfileService);
  mentorProfileServices = inject(MentorProfileService);
  router = inject(Router);
  file: File | null = null;

  constructor(private fb: FormBuilder) {
    this.mentorForm = this.fb.group({
      name: ['', Validators.required],
      avatar: [],
      email: ['', Validators.required],
      country: ['', Validators.required],
      language: ['', Validators.required],
      mentorRole: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.mentor = JSON.parse(localStorage.getItem('MentorData') || '{}');
    if (this.mentor) {
      this.mentorForm.patchValue({
        name: this.mentor.name,
        email: this.mentor.email,
        country: this.mentor.country,
        language: this.mentor.language,
        mentorRole: this.mentor.mentorRole,
        description: this.mentor.description,
      });

      // Set avatar preview if avatar is available
      if (this.mentor.avatar) {
        this.avatarPreview = this.mentor.avatar;
        console.log(this.mentor.avatar);
      }
    }

    this.mentorProfileServices.requestGetFeedbackRatings(this.mentor?.id||'').subscribe(
      (response: any) => {
        this.reviews = response.feedbackRatings;
      },
      (error) => {
        console.error('Error fetching mentor data', error.message);
      }
    )
  }

  openEditModal() {
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  requestEditMemberData() {
    if (this.mentorForm.valid) {
      const formData = new FormData();
      const formValue = this.mentorForm.value;

      // Append each form field to FormData
      for (const key in formValue) {
        if (formValue[key]) {
          formData.append(key, formValue[key]);
        }
      }

      if (this.file) {
        formData.append('image', this.file, this.file.name);
      }

      this.mentorProfileServices.requestEditMentorData(formData).subscribe(
        (response: any) => {
          this.mentor = response.mentorData;
          this.closeEditModal();
        },
        (error) => {
          console.error('Error updating mentor data', error.message);
        }
      );
    }
  }

  openProfileModal() {
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }
}
