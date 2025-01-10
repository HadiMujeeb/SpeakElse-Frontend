import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { loginFields } from '../../../shared/FieldConfigs/login-form.config';
import { Router } from '@angular/router';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { IUserLoginCredentials } from '../../../shared/models/login-form.model';
import { CommonModule } from '@angular/common';
import { MentorauthService } from '../../../core/services/mentor/mentorauth.service';

@Component({
  selector: 'app-mentor-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './mentor-login.component.html',
  styleUrl: './mentor-login.component.css'
})
export class MentorLoginComponent {
  AuthUserServices = inject(AuthUserService);
  authMentorServices = inject(MentorauthService);
  router = inject(Router);

  loginForm: FormGroup;
  fields = loginFields;
  loginError: string | null = null;
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.fields.find((f) => f.name === fieldName);
    if (field) {
      const control = this.loginForm.get(fieldName);
      if (control && control.errors) {
        const firstErrorType = Object.keys(control.errors)[0];
        const errorMessage = field.errors?.find(
          (err) => err.type === firstErrorType
        )?.message;
        return errorMessage || '';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: IUserLoginCredentials = this.loginForm.value;

      this.authMentorServices.requestMentorLogin(credentials).subscribe(
        (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('mentorToken', response.accessToken);
          this.router.navigate(['/mentor/main/dashboard']);
        },
        (error) => {
          console.log(error); 
          console.error('Login failed:', error.message);
          if (error.message === 'Mentor not found.') {
            this.loginForm.get('email')?.setErrors({ notExist: true });
          } else if (error.message == "Invalid password. Please try again.") {
            this.loginForm.get('password')?.setErrors({ incorrect: true });
          } else {
            this.loginError = 'Login failed. Please try again later.';
          }
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


}
