import { Component, inject } from '@angular/core';
import { OtpFromComponent } from '../../../../../shared/components/authentication/authForm/otp-from/otp-from.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUserService } from '../../../../../core/services/user/auth-user.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [OtpFromComponent,ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OTPComponent {
  
}
