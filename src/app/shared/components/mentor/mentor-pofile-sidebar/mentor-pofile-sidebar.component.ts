import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mentor-pofile-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './mentor-pofile-sidebar.component.html',
  styleUrl: './mentor-pofile-sidebar.component.css'
})
export class MentorPofileSidebarComponent {
  menuItems = [
    { icon: 'user', label: 'Profile', route: 'profile' },
    { icon: 'calendar-alt', label: 'My Sessions', route: 'sessions' },
    { icon: 'wallet', label: 'Wallet', route: 'wallet' },
  ];

  // Add logic for logging out if required
  logout() {
    console.log('Mentor logged out');
    // Handle logout logic here (e.g., clear session, navigate to login page)
  }
}
