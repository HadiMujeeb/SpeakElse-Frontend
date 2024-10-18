import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthUserService } from '../../core/services/user/auth-user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {

  AuthUserServices = inject(AuthUserService);
  router = inject(Router)
  private subscription :Subscription = new Subscription()


  @Input() logoUrl: string = "../../../assets/images/letter-s (1).png";
  @Input() brandName: string = 'SpeakElse';
  @Input() navLinks: { label: string; url: string }[] = [
    { label: 'Rooms', url: '/rooms' },
    { label: 'Rooms', url: '/rooms' },
    { label: 'Rooms', url: '/rooms' },
  ];
  @Input() isLoggedIn: boolean = false;

  @Output() logout = new EventEmitter<void>();

  dropdownVisible = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

 ngOnInit(): void {
  this.subscription= this.AuthUserServices.isLoggedIn$().subscribe(isLoggedIn =>{
    this.isLoggedIn =isLoggedIn;
    console.log(this.isLoggedIn,"codeeede")
   })
 }



  onLogout():void {
    this.AuthUserServices.logoutRequest().subscribe(
      reponse =>{
        console.log("logout ",reponse)
        this.router.navigate(['/']).then(()=>{
          window.location.reload();
        })
      }
    )
  }
}
