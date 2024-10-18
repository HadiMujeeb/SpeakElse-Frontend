import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {};
  private subscriptions: Subscription = new Subscription();
  errorMessage: string = '';

  constructor(private authServices: AuthUserService,private router:Router) {}

 
  ngOnInit(): void {
    this.getUserProfile();
    console.log('user',this.user)
  };

  getUserProfile(): void {
    this.subscriptions.add(
      this.authServices.getUserData().subscribe({
        next: (data) => { 
          if (data) {
            this.user = data;
            console.log('User Profile', this.user);
          } else {
            console.error('No user data available.');
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load user profile';
          console.error('Error fetching user profile:', err);
        },
      })
    );
  }
  
  
}
