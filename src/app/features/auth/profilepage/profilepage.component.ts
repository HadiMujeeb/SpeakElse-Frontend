import { Component } from '@angular/core';
import { ProfileSidebarComponent } from '../../../shared/components/profile-sidebar/profile-sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profilepage',
  standalone: true,
  imports: [ProfileSidebarComponent,RouterOutlet],
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.css'
})
export class ProfilepageComponent {

}
