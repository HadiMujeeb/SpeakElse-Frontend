import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
isLoggedIn:boolean = false;
AuthService = inject(AuthUserService);

ngOnInit(): void {
  this.AuthService.isLoggedIn().subscribe(status =>{
    this.isLoggedIn = status
  })
}

onLogout(){
  this.AuthService.logout();
}



}
