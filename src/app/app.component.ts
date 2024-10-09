import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WelcomeComponent } from './features/components/user/welcome/welcome.component';
import { RegisterFormComponent } from './shared/components/authentication/authForm/register-form/register-form.component';
import { OtpFromComponent } from './shared/components/authentication/authForm/otp-from/otp-from.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,OtpFromComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';
}
