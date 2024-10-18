import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OtpFromComponent } from './shared/components/authentication/authForm/otp-from/otp-from.component';
import { HeaderComponent } from './layouts/header/header.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,OtpFromComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';
}
