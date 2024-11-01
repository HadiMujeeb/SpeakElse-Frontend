import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mentor-pofile-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentor-pofile-sidebar.component.html',
  styleUrl: './mentor-pofile-sidebar.component.css'
})
export class MentorPofileSidebarComponent {
  menuItems = [
    // { icon: 'briefcase', label: 'My Job Feed' },
    { icon: 'user', label: 'Profile' },
    // { icon: 'chart-bar', label: 'Dashboard' },
    // { icon: 'bookmark', label: 'Saved Jobs' },
    // { icon: 'cog', label: 'Settings' },
  ];
}
