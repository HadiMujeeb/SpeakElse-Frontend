// src/app/components/register/register.component.ts
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavLogoComponent } from '../../../../shared/layouts/nav-logo/nav-logo.component';
import { CommonModule } from '@angular/common';
import { registerField } from '../../../../shared/FieldConfigs/register-form.config';
import { IUserRegisterationCredentials } from '../../../../shared/models/register-form.model';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { Router, RouterLink } from '@angular/router';
import { noWhitespaceValidator } from '../../../../shared/utilitys/whiteSpaceValidate';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NavLogoComponent, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  fields = this.filterFields(registerField);
  loginError: string | null = null;
  AuthUserServices = inject(AuthUserService);
  router = inject(Router);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            noWhitespaceValidator
          ],
        ],
        email: ['', [Validators.required, Validators.email, noWhitespaceValidator]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            ),
            noWhitespaceValidator
          ],
        ],
        confirmPassword: ['', [Validators.required, noWhitespaceValidator]],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  

  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  private filterFields(fields: any[]): any[] {
    const excludedFields = [
      'country',
      'role',
      'description',
      'language',
      'profession',
      'avatar',
    ];
    return fields.filter((field) => !excludedFields.includes(field.name));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.fields.find((f) => f.name === fieldName);
    if (field) {
      const control = this.registrationForm.get(fieldName);
      if (control && control.errors) {
        const firstErrorType = Object.keys(control.errors)[0];

        const errorMessage = field.errors.find(
          (err: any) => err.type === firstErrorType
        )?.message;

        return errorMessage || '';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const email = this.registrationForm.get('email')?.value;
      localStorage.setItem('email', email);
      localStorage.removeItem('remainingTime');
      console.log('Form Submitted:', this.registrationForm.value);

      const credentials: IUserRegisterationCredentials =
        this.registrationForm.value;

      this.AuthUserServices.RegisterationRequest(credentials).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/auth/otp']);
        },
        (error) => {
          console.error('Registration failed:', error.message);
          this.loginError = error.message;
        }
      );
    } else {
      this.registrationForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}
