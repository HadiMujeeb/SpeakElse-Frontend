// src/app/components/register/register.component.ts
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavLogoComponent } from '../../../../shared/reusable/nav-logo/nav-logo.component';
import { CommonModule } from '@angular/common';
import { registerField } from '../../../../shared/reusable/formFieldConfig/registerFormConfig';
import { FormImageComponent } from '../../../../shared/reusable/form-image/form-image.component';
import { IUserRegisterationCredentials } from '../../../../models/auth/RegistrationForm.interface';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NavLogoComponent,
    CommonModule,
    FormImageComponent,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  fields = this.filterFields(registerField);
  loginError:string|null =null
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
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
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
    const excludedFields = ['country', 'role', 'description', 'language', 'profession','avatar'];
    return fields.filter(field => !excludedFields.includes(field.name));
  }


  getErrorMessage(fieldName: string): string {
    const field = this.fields.find((f) => f.name === fieldName);
    if (field) {
      const control = this.registrationForm.get(fieldName);
      if (control && control.errors) {

        const firstErrorType = Object.keys(control.errors)[0];

        const errorMessage = field.errors.find(
          (err:any) => err.type === firstErrorType
        )?.message;
        
        return errorMessage || '';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const email =this.registrationForm.get('email')?.value
      localStorage.setItem('userGmail',email);
      console.log('Form Submitted:', this.registrationForm.value);

      const credentials: IUserRegisterationCredentials =this.registrationForm.value;

      this.AuthUserServices.RegisterationRequest(credentials).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/auth/otp']);
        },
        (error) => {
          console.error('Registration failed:', error.message);
          this.loginError = error.message
        }
      );
    } else {
      this.registrationForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}
