import { Component, inject } from '@angular/core';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-sidebar.component.html',
  styleUrl: './profile-sidebar.component.css',
})
export class ProfileSidebarComponent {
  authServices = inject(AuthUserService);
  router = inject(Router);

  logout(): void {
    this.authServices.logoutRequest().subscribe({
      next: (response) => {
        // Handle successful logout, maybe redirect to login or home page
        console.log('Logout successful', response);
        // You can navigate to the login or home page using Angular's router
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        // Handle error during logout
        console.error('Logout failed', err);
      },
      complete: () => {
        // Optional: Handle any final actions after logout
        console.log('Logout request completed');
      },
    });
  }
}
