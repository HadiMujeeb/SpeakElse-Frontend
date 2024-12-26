import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { resetEmail } from '../../../shared/FieldConfigs/reset-password.config';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavLogoComponent } from '../../../layouts/user/nav-logo/nav-logo.component';

@Component({
  selector: 'app-reset-password-mail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavLogoComponent, RouterLink],
  templateUrl: './reset-password-mail.component.html',
  styleUrl: './reset-password-mail.component.css',
})
export class ResetPasswordMailComponent {
  resetPasswordForm!: FormGroup;
  resetError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthUserService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.value.email;

      console.log(email, 'email');

      this.authService.sendResetPasswordEmail(email).subscribe(
        (response) => {
          this.resetPasswordForm.reset();
          console.log('Reset password email sent:', response);
        },
        (error) => {
          console.error('Error sending reset password email:', error);
          this.resetError = error.message;
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
