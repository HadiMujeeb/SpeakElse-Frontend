import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { resetEmail } from '../../../shared/reusable/formFieldConfig/resetpasswordconfig';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavLogoComponent } from '../../../shared/reusable/nav-logo/nav-logo.component';

@Component({
  selector: 'app-reset-password-mail',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NavLogoComponent],
  templateUrl: './reset-password-mail.component.html',
  styleUrl: './reset-password-mail.component.css'
})
export class ResetPasswordMailComponent {
  resetPasswordForm!: FormGroup;
  resetPasswordFields = resetEmail;
  resetError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthUserService, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.value.email;

      console.log(email,"email")

      this.authService.sendResetPasswordEmail(email).subscribe(
        (response) => {
          console.log('Reset password email sent:', response);
        },
        (error) => {
          console.error('Error sending reset password email:', error);
          this.resetError = error.message; // Capture error message to display to the user
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.resetPasswordFields.find((f) => f.name === fieldName);
    if (field) {
      const control = this.resetPasswordForm.get(fieldName);
      if (control && control.errors) {
        const firstErrorType = Object.keys(control.errors)[0];
        const errorMessage = field.errors.find((err) => err.type === firstErrorType)?.message;
        return errorMessage || '';
      }
    }
    return '';
  }
}
