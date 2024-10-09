import { Component } from '@angular/core';
import { NavLogoComponent } from '../../../../../shared/components/authentication/header/nav-logo/nav-logo.component';
import { LoginFormComponent } from '../../../../../shared/components/authentication/authForm/login-form/login-form.component';
import { AuthBodyComponent } from '../../../../../shared/components/authentication/auth-body/auth-body.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthBodyComponent,LoginFormComponent,NavLogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
