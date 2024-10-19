import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../../layouts/admin/admin-header/admin-header.component';
import { SideBarComponent } from '../../../layouts/admin/side-bar/side-bar.component';
import { MembersComponent } from '../../../layouts/admin/members/members.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminHeaderComponent,SideBarComponent,MembersComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
