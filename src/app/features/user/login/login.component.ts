declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { loginFields } from '../../../shared/FieldConfigs/login-form.config';
import { CommonModule } from '@angular/common';
import { AuthUserService } from '../../../core/services/user/auth-user.service';
import { Router, RouterLink } from '@angular/router';
import { IUserLoginCredentials } from '../../../shared/models/login-form.model';
import { NavLogoComponent } from '../../../layouts/user/nav-logo/nav-logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavLogoComponent, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  authUserServices = inject(AuthUserService);
  router = inject(Router);

  loginForm: FormGroup;
  fields = loginFields;
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '375727929622-2sc3pkkhj1c6541e0mvrmeu6bfgq2lqp.apps.googleusercontent.com',
      callback: this.handleGoogleResponse.bind(this),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleGoogleResponse(response: any): void {
    const idToken = response.credential;
    this.authUserServices.loginWithGoogle(idToken).subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        this.router.navigate(['/user/home']);
      },
      error: (error) => {
        if (error.message == 'User not found.') {
          this.router.navigate(['/auth/register'])
        }
      },
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
      this.authUserServices.loginRequest(credentials).subscribe({
        next: (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          this.router.navigate(['/user/home']);
        },
        error: (error) => {
          if (error.message === 'User not found.') {
            this.loginForm.get('email')?.setErrors({ notExist: true });
          } else if (error.message === 'Invalid password. Please try again.') {
            this.loginForm.get('password')?.setErrors({ incorrect: true });
          } else {
            console.error("Login Failed:",error.message)
          }
        },
      });
      
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
