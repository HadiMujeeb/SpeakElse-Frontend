import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  profileForm!: FormGroup;
  user: any = {};

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authServices: AuthUserService,
    private fb: FormBuilder,
    private router: Router
    
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.subscriptions.add(
      this.authServices.getUserData().subscribe({
        next: (data) => {
          if (data) {
            this.user = data;
            console.log('User Profile:', this.user);

            // Initialize or update the form with fetched user data
            this.initializeForm();
          } else {
            console.error('No user data available.');
          }
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
        },
      })
    );
  }

  initializeForm(): void {
    // Initialize the form after user data is available
    this.profileForm = this.fb.group({
      name: [this.user.name || '', [Validators.required]],
      country: [this.user.country || '', [Validators.required]],
      profession: [this.user.profession || '', [Validators.required]], // Fixed typo here
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const { id, name, country, profession } = this.profileForm.value;
      const userId = this.user.id
      console.log("working",userId)
      this.authServices.editUserProfile({ userId, name, country, profession }).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
        },
        error: (err) => {
          console.error('Failed to update profile:', err.message);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
