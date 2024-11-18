import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { resetPasswordField } from '../../../../shared/FieldConfigs/reset-password.config';
import { CommonModule } from '@angular/common';
import { NavLogoComponent } from '../../../../shared/layouts/nav-logo/nav-logo.component';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavLogoComponent],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css',
})
export class ResetPasswordComponent {
  router = inject(Router);
  authUserServices = inject(AuthUserService);
  resetPasswordForm!: FormGroup;
  resetPasswordFields = resetPasswordField;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(formGroup: FormGroup): any {
    const password = formGroup.get('newPassword');
    const confirmPassword = formGroup.get('confirmPassword');
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      // thisconfirmPassword.setErrors(null);
    }
  }

  // Function to get error message for each field
  getErrorMessage(field: string): string {
    const control = this.resetPasswordForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }
    if (control?.hasError('pattern')) {
      return 'Password must include an uppercase letter, a lowercase letter, a number, and a special character';
    }
    if (control?.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      console.log('Form Submitted:', this.resetPasswordForm.value);

      // Get the token from the URL query parameters
      const token = this.route.snapshot.queryParamMap.get('token');

      if (token) {
        const password = this.resetPasswordForm.get('newPassword')?.value; // Get the new password
        console.log('Password:', password);
        this.authUserServices.requestResetPassword(token, password).subscribe(
          (response) => {
            console.log('Password reset successful:', response);
            this.router.navigate(['auth/login']);
          },
          (error) => {
            console.error('Error resetting password:', error);
          }
        );
      } else {
        console.error('Token not found in the URL');
      }
    }
  }
}
