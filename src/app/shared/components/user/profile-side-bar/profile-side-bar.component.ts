import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-side-bar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './profile-side-bar.component.html',
  styleUrl: './profile-side-bar.component.css'
})
export class ProfileSideBarComponent {
  // menuItems = [
  //   { icon: 'user', label: 'Profile', active: true },
  //   { icon: 'calendar', label: "Booked Sessions" },
  //   { icon: 'cog', label: 'Setting' },
  // ];

  menuItems = [
    { icon: 'user', label: 'Profile', route: 'profile' },
    { icon: 'calendar-alt', label: 'My Sessions', route: 'mysession' },
    { icon: 'wallet', label: 'Wallet', route: 'wallet' },
  ];
  authUserSerivices = inject(AuthUserService);  
  router = inject(Router);

  onLogout():void{
    this.authUserSerivices.logoutRequest().subscribe(
      response =>{
        this.router.navigate(['/user/home'])
        console.log("logout successfully",response.message)
      },error =>{
        console.error("logout error",error.message)
      }
    )
  }

}
