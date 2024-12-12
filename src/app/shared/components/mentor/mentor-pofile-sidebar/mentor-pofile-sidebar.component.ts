import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MentorauthService } from '../../../../core/services/mentor/mentorauth.service';

@Component({
  selector: 'app-mentor-pofile-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './mentor-pofile-sidebar.component.html',
  styleUrl: './mentor-pofile-sidebar.component.css'
})
export class MentorPofileSidebarComponent {
  authMentorServices = inject(MentorauthService);
  router = inject(Router) 

  menuItems = [
    { icon: 'user', label: 'Profile', route: 'profile' },
    { icon: 'calendar-alt', label: 'My Sessions', route: 'sessions' },
    { icon: 'wallet', label: 'Wallet', route: 'wallet' },
  ];


  logout() {
    localStorage.removeItem('mentorToken');
    localStorage.removeItem('MentorData');
    this.authMentorServices.requestMentorLogout().subscribe(() => {
      this.router.navigate(['/mentor/login']);
    })
  
  }
}
