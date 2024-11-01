import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { loginFields } from '../../../../shared/FieldConfigs/loginFormConfig';
import { CommonModule } from '@angular/common';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { Router, RouterLink } from '@angular/router';
import { IUserLoginCredentials } from '../../../../shared/models/LoginForm.interface';
import { NavLogoComponent } from '../../../../layouts/nav-logo/nav-logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavLogoComponent, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  AuthUserServices = inject(AuthUserService);
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

      this.AuthUserServices.loginRequest(credentials).subscribe(
        (response) => {
          console.log('Login successful:', response);

          this.router.navigate(['/user/home']);
        },
        (error) => {
          console.error('Login failed:', error.message);
          // this.loginError = error.message;

          if(error.message ==='User not found.') {
            this.loginForm.get('email')?.setErrors({ 'notExist': true });
            console.log('fwwnonwofnwon')
          }else if(error.message ==='Invalid password. Please try again.'){
            this.loginForm.get('password')?.setErrors({ 'incorrect': true });
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
