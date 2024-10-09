import { Component } from '@angular/core';
import { NavLogoComponent } from '../header/nav-logo/nav-logo.component';
import { LoginFormComponent } from '../authForm/login-form/login-form.component';

@Component({
  selector: 'app-auth-body',
  standalone: true,
  imports: [NavLogoComponent,LoginFormComponent],
  templateUrl: './auth-body.component.html',
  styleUrl: './auth-body.component.css'
})
export class AuthBodyComponent {

}
