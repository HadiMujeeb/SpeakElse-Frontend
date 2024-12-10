import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  menuItems = [
    { icon: 'home', label: 'Dashboard', route: 'dashboard' },
    { icon: 'members', label: 'Members', route: 'members' },
    { icon: 'tests', label: 'Tests', route: 'tests' },
    { icon: 'shield', label: 'ApplicationForm', route: 'applicationForm' },
    { icon: 'dollar-sign', label: 'Earnings', route: 'earnings' },
    { icon: 'message-square', label: 'Feedback', route: 'feedback' },
    { icon: 'bar-chart', label: 'Analytics', route: 'analytics' },
    { icon: 'bell', label: 'Notifications', route: 'notifications' },
    { icon: 'settings', label: 'Settings', route: 'settings' },
    { icon: 'credit-card', label: 'Wallet', route: 'wallet' },
  ];
}  

