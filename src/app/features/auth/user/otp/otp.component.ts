import { Component, inject } from '@angular/core';
import { OtpFromComponent } from '../../../../shared/components/authentication/authForm/otp-from/otp-from.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { NavLogoComponent } from '../../../../shared/reusable/nav-logo/nav-logo.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { VerifyOtpRequest } from '../../../../models/auth/OTPRequest.interface';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [OtpFromComponent, ReactiveFormsModule, NavLogoComponent,CommonModule,AsyncPipe],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OTPComponent {
  AuthServices = inject(AuthUserService);
  router = inject(Router);
  otpForm!: FormGroup;
  timeLeft: number = 60;  
  interval!: Subscription;
  disableResendButton: boolean = true; 
  isTimerRunning: boolean = true; 

  private timeLeftSubject = new BehaviorSubject<number>(60);
   timeLeft$ = this.timeLeftSubject.asObservable();

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.maxLength(1)]],
      digit2: ['', [Validators.required, Validators.maxLength(1)]],
      digit3: ['', [Validators.required, Validators.maxLength(1)]],
      digit4: ['', [Validators.required, Validators.maxLength(1)]]
    });
  }
  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    this.interval = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timeLeftSubject.next(this.timeLeft)
      } else {
        this.isTimerRunning = false; 
        this.interval.unsubscribe();  
      }
    });
  }
  onDigitInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const nextInput = input.nextElementSibling as HTMLInputElement;

    if (input.value.length === 1 && nextInput) {
      nextInput.focus(); 
    }
  }

  onSubmit() {
    if (this.otpForm.valid && this.isTimerRunning) {

   const email = localStorage.getItem('userGmail');
   console.log("email",email)
   const enteredotp = Object.values(this.otpForm.value).join('');
   const credentials:VerifyOtpRequest ={
    email,
    enteredotp
   }
   this.AuthServices.VerifyOtp(credentials).subscribe(
    response =>{
      console.log('OTP verified successfully:', response);
      this.router.navigate(['/'])
    },
    error =>{
      console.error('Error verifying OTP:', error);
    }
   )

    } else if (!this.isTimerRunning) {
      console.error('Time is up! Cannot submit OTP.');
    }
  }

  resendOtp() {
    // Logic for resending OTP
    console.log('Resend OTP requested');

    // Reset timer
    this.timeLeft = 60;
    this.isTimerRunning = true;
    this.startTimer();
  }
}
