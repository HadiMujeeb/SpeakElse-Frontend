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
import { interval, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { VerifyOtpRequest } from '../../../shared/models/otp-request.model';
import { lastValueFrom } from 'rxjs'; // Import lastValueFrom for RxJS 7+

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
  showError = false;
  errorMessage = '';
  resendDisabled = false;

  private readonly TIMER_DURATION = 120; // Total timer duration in seconds
  public circumference = 2 * Math.PI * 45;
  remainingTime: number;
  private timerProgress = 100;
  private destroy$ = new Subject<void>();
  responseMessage: string | null = null;
  resendTimer: number | null = null;
  otpControls = Array.from({ length: 4 });

  constructor() {
    this.initForm();
    this.remainingTime = this.getRemainingTime();
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

    this.resendDisabled = this.remainingTime <= 0;

    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          this.timerProgress = (this.remainingTime / this.TIMER_DURATION) * 100;
          this.resendTimer = this.remainingTime;
        } else {
          this.resendDisabled = false;
          this.resendTimer = null;
        }

        this.saveRemainingTime();
      });
  }

  getDashOffset(): number {
    return this.circumference - (this.timerProgress / 100) * this.circumference;
  }

  onOtpInput(event: any, index: number) {
    const input = event.target;
    const nextInput = input.nextElementSibling;
    const prevInput = input.previousElementSibling;

    this.showError = false;

    if (event.data && !/^[0-9]$/.test(event.data)) {
      input.value = '';
      return;
    }

    if (input.value && nextInput && index < 3) {
      nextInput.focus();
    }

    if (event.key === 'Backspace' && prevInput && !input.value) {
      prevInput.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const pastedData = clipboardData.getData('text').trim();

    if (!/^\d{4}$/.test(pastedData)) {
      this.showError = true;
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

  async resendOtp() {
    if (this.resendDisabled) return;

    try {
      this.destroy$.next();
      this.destroy$.complete();

      this.destroy$ = new Subject<void>();

      this.otpForm.reset();
      this.startTimer();
      this.resendDisabled = true;
      this.showError = false;
      const email = this.getEmail();
      const response = await lastValueFrom(this.AuthServices.resentOtp(email));

      if (response) {
        console.log('OTP resent successfully:', response);
        this.responseMessage = response.message || 'OTP sent successfully!';
      } else {
        this.showError = true;
        this.errorMessage = 'Failed to resend OTP. Please try again.';
      }
    } catch (error) {
      this.showError = true;
      this.errorMessage = 'Failed to resend OTP. Please try again.';
    }
  }

  onSubmit() {
    if (this.otpForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.showError = false;

      const email = this.getEmail();

      if (!email) {
        this.showError = true;
        this.errorMessage = 'Email not found in local storage.';
        this.isSubmitting = false;
        return;
      }

      const enteredOtp = Object.values(this.otpForm.value).join('');
      const data: VerifyOtpRequest = { email, enteredotp: enteredOtp };

      this.AuthServices.VerifyOtp(data).subscribe({
        next: (response) => {
          if (response.message) {
            localStorage.setItem('accessToken', response.accessToken);
            this.router.navigate(['/user/home']);
          }
        },
        error: (error) => {
          this.showError = true;
          console.error('Error:', error?.error?.message || error);
          this.errorMessage =
            error.error?.message || 'An error occurred. Please try again.'; // Ensure correct error message display
        },
        complete: () => {
          this.isSubmitting = false;
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
}
