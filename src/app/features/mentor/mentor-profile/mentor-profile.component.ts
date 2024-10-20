import { Component } from '@angular/core';

import { MentorPofileContentComponent } from '../../../shared/mentor/mentor-pofile-content/mentor-pofile-content.component';
import { MentorPofileSidebarComponent } from '../../../shared/mentor/mentor-pofile-sidebar/mentor-pofile-sidebar.component';
import { MentorPofileHeaderComponent } from '../../../shared/mentor/mentor-pofile-header/mentor-pofile-header.component';

@Component({
  selector: 'app-mentor-profile',
  standalone: true,
  imports: [MentorPofileContentComponent,MentorPofileSidebarComponent,MentorPofileHeaderComponent],
  templateUrl: './mentor-profile.component.html',
  styleUrl: './mentor-profile.component.css'
})
export class MentorProfileComponent {

}
