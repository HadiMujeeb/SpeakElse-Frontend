import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin/admin.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent implements OnInit{
  adminServices = inject(AdminService)
  admin:any
  
router = inject(Router)
ngOnInit(): void {
  const adminData = localStorage.getItem('adminData');
  if (adminData) {
    this.admin = JSON.parse(adminData);
  }
}


logout():void{
this.adminServices.requestLogoutAdmin().subscribe(() =>{
  localStorage.removeItem('adminData');
  localStorage.removeItem('adminToken');
  this.router.navigate(['/admin/login'])
})

}
}
