import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-side-bar.component.html',
  styleUrl: './profile-side-bar.component.css'
})
export class ProfileSideBarComponent {
  menuItems = [
    { icon: 'user', label: 'My Profile', active: true },
    { icon: 'calendar', label: 'My Session' },
    { icon: 'cog', label: 'Setting' },
  ];
}
