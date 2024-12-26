import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../../layouts/admin/admin-header/admin-header.component';
import { SideBarComponent } from '../../../layouts/admin/side-bar/side-bar.component';
import { MembersComponent } from '../members/members.component';
import { RouterEvent, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [AdminHeaderComponent,SideBarComponent,RouterModule,RouterLink,MembersComponent,RouterOutlet],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

}
