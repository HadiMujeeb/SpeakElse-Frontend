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
    { icon: 'bar-chart', label: 'Reports', route: 'reports' }, 
    { icon: 'credit-card', label: 'Wallet', route: 'wallet' },
  ];
}

