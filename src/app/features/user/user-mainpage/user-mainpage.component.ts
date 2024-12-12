import { Component } from '@angular/core';
import { ProfileContentComponent } from '../../../shared/components/user/profile-content/profile-content.component';
import { ProfileSideBarComponent } from '../../../shared/components/user/profile-side-bar/profile-side-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-mainpage',
  standalone: true,
  imports: [ProfileContentComponent,ProfileSideBarComponent,RouterOutlet],
  templateUrl: './user-mainpage.component.html',
  styleUrl: './user-mainpage.component.css'
})
export class UserMainpageComponent {

}
