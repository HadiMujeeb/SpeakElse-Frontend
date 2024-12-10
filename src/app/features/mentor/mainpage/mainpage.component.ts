import { Component } from '@angular/core';
import { MentorPofileContentComponent } from '../../../shared/components/mentor/mentor-pofile-content/mentor-pofile-content.component';
import { MentorPofileSidebarComponent } from '../../../shared/components/mentor/mentor-pofile-sidebar/mentor-pofile-sidebar.component';
import { RouterModule } from '@angular/router';

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
