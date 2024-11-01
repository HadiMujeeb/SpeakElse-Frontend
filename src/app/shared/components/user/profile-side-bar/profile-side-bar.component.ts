import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-side-bar.component.html',
  styleUrl: './profile-side-bar.component.css'
})
export class ProfileSideBarComponent {
  menuItems = [
    { icon: 'user', label: 'My Profile', active: true },
    // { icon: 'calendar', label: 'My Session' },
    // { icon: 'cog', label: 'Setting' },
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
