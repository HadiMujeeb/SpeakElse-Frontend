import { Component, inject } from '@angular/core';
import { MentorPofileContentComponent } from '../../../shared/components/mentor/mentor-pofile-content/mentor-pofile-content.component';
import { MentorPofileSidebarComponent } from '../../../shared/components/mentor/mentor-pofile-sidebar/mentor-pofile-sidebar.component';
import { Router, RouterModule } from '@angular/router';
import { MentorauthService } from '../../../core/services/mentor/mentorauth.service';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [ MentorPofileContentComponent,
    MentorPofileSidebarComponent,
    RouterModule],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {
 
}
