import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  menuItems = [
    { icon: 'home', label: 'Dashboard' },
    { icon: 'users', label: 'Users' },
    { icon: 'user-check', label: 'Mentors' },
    { icon: 'shield', label: 'Moderation' },
    { icon: 'dollar-sign', label: 'Earnings' },
    { icon: 'message-square', label: 'Feedback' },
    { icon: 'bar-chart', label: 'Analytics' },
    { icon: 'bell', label: 'Notifications' },
    { icon: 'settings', label: 'Settings' },
    { icon: 'credit-card', label: 'Wallet' },
  ];
}
