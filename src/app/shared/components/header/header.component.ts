import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; 
  dropdownVisible: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private authService: AuthUserService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the isLoggedIn$ observable
    this.subscriptions.add(
      this.authService.isLoggedIn$().subscribe(loggedIn => {
        this.isLoggedIn = loggedIn; // Update the local variable
        console.log('Login Status:', this.isLoggedIn); // Optional: Log the status
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.subscriptions.unsubscribe();
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  onLogout(): void {
    this.authService.logoutRequest().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']); 
      },
      error: (err) => {
        console.error('Logout error:', err);
      }
    });
  }
}
