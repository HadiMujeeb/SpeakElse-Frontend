import { Component } from '@angular/core';
import { ProfileContentComponent } from '../../../shared/components/user/profile-content/profile-content.component';
import { ProfileSideBarComponent } from '../../../shared/components/user/profile-side-bar/profile-side-bar.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileContentComponent,ProfileSideBarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
