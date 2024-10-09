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
  AuthServices = inject(AuthUserService)
  otpForm!: FormGroup;
  
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.maxLength(1)]],
      digit2: ['', [Validators.required, Validators.maxLength(1)]],
      digit3: ['', [Validators.required, Validators.maxLength(1)]],
      digit4: ['', [Validators.required, Validators.maxLength(1)]]
    });
  }

  onDigitInput(event: any) {
    let element;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;

    if (element == null)
      return;
    else
      element.focus();
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
     
    }
  }
}
