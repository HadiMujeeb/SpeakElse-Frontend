import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { NavLogoComponent } from '../../../layouts/user/nav-logo/nav-logo.component';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { VerifyOtpRequest } from '../../../shared/models/otp-request.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule, NavLogoComponent, CommonModule, AsyncPipe],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OTPComponent implements OnInit, OnDestroy {
  AuthServices = inject(AuthUserService);
  router = inject(Router);

  otpForm!: FormGroup;
  isSubmitting = false;
  errorMessage:string|null = null;
  resendDisabled:boolean = false

  private readonly TIMER_DURATION = 120;
  remainingTime: number;
  responseMessage: string | null = null;
  resendTimer: number | null = null;
  otpControls = Array.from({ length: 4 });

  private intervalId: any;

  constructor() {
    this.initForm();
    this.remainingTime = this.getRemainingTime();
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.saveRemainingTime();
  }

  private initForm() {
    this.otpForm = new FormGroup({});
    for (let i = 0; i < 4; i++) {
      this.otpForm.addControl(
        `digit${i}`,
        new FormControl('', [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern(/^[0-9]$/),
        ])
      );
    }
  }

  private startTimer() {
    if (this.remainingTime <= 0) {
      this.remainingTime = this.TIMER_DURATION;
    }


    this.intervalId = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.resendTimer = this.remainingTime;
      } else {
        clearInterval(this.intervalId);
        this.resendTimer = null;
      }

      this.saveRemainingTime();
    }, 1000);
  }

  onOtpInput(event: any, index: number) {
    this.responseMessage =null
    const input = event.target;
    const nextInput = input.nextElementSibling;
    const prevInput = input.previousElementSibling;

    if (event.data && !/^[0-9]$/.test(event.data)) {
      input.value = '';
      return;
    }

    if (input.value && nextInput && index < 3) {
      nextInput.focus();
    }

    if (event.key === 'Backspace' && prevInput && !input.value) {
      prevInput.focus();
      this.errorMessage = null
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const pastedData = clipboardData.getData('text').trim();

    if (!/^\d{4}$/.test(pastedData)) {
      this.errorMessage = 'Please paste a valid 4-digit code';
      return;
    }

    const otpDigits = pastedData.split('');
    otpDigits.forEach((digit, index) => {
      if (index < 4) {
        this.otpForm.get(`digit${index}`)?.setValue(digit);
      }
    });
  }

  private getEmail() {
    return localStorage.getItem('email');
  }

  resendOtp() {
    clearInterval(this.intervalId);
    this.remainingTime = 0
    this.saveRemainingTime()
    this.otpForm.reset()
    this.resendDisabled = true
    this.responseMessage = null
    this.errorMessage = null
  
    const email = this.getEmail();
  
    this.AuthServices.resentOtp(email).subscribe({
      next: (response) => {
        this.responseMessage = response.message;
        this.startTimer();
        this.resendDisabled = false
      },
      error: (error) => {
        this.errorMessage = 'Failed to resend OTP. Please try again.';
      },
    });
  }
  

  onSubmit() {
    if (this.otpForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const email = this.getEmail();

      if(!email) return
      const enteredOtp = Object.values(this.otpForm.value).join('');
      const data: VerifyOtpRequest = { email, enteredotp: enteredOtp };

      this.AuthServices.VerifyOtp(data).subscribe({
        next: (response) => {
          if (response.message) {
            localStorage.setItem('Token', response.accessToken);
            this.router.navigate(['/user/home']);
          }
        },
        error: (error) => {
          this.errorMessage =error.error?.message || 'An error occurred. Please try again.';
          this.isSubmitting = false
        },
        complete: () => {
          this.isSubmitting = false;
          clearInterval(this.intervalId);
          this.remainingTime = 0
          this.removeRemainingTime()
        },
      });
    }
  }

  private getRemainingTime(): number {
    const savedTime = localStorage.getItem('remainingTime');
    return savedTime ? Number(savedTime) : this.TIMER_DURATION;
  }

  private saveRemainingTime(): void {
    localStorage.setItem('remainingTime', this.remainingTime.toString());
  }

  private removeRemainingTime():void{
    localStorage.removeItem('remainingTime')
  }
}
