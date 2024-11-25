import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin/admin.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  adminServices = inject(AdminService)
  adminName = 'zayim';
router = inject(Router)
logout():void{
// localStorage.removeItem('adminData');
// this.router.navigate(['/admin/login'])
this.adminServices.requestLogoutAdmin().subscribe(() =>{
  localStorage.removeItem('adminData');
  localStorage.removeItem('adminToken');
  this.router.navigate(['/admin/login'])
})

}
}
