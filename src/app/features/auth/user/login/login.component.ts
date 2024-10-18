import { Component, inject } from '@angular/core';
import { NavLogoComponent } from '../../../../shared/components/authentication/header/nav-logo/nav-logo.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { loginFields } from '../../../../shared/reusable/formFieldConfig/loginFormConfig';
import { CommonModule } from '@angular/common';
import { FormImageComponent } from '../../../../shared/reusable/form-image/form-image.component';
import { AuthUserService } from '../../../../core/services/user/auth-user.service';
import { Router, RouterLink } from '@angular/router';
import { IUserLoginCredentials } from '../../../../models/auth/LoginForm.interface';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavLogoComponent,
    CommonModule,
    ReactiveFormsModule,
    FormImageComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  AuthUserServices = inject(AuthUserService);
  router = inject(Router);


  loginForm: FormGroup;
  fields = loginFields;
  loginError : string | null = null;
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials:IUserLoginCredentials = this.loginForm.value;
 
      this.AuthUserServices.loginRequest(credentials).subscribe(
      response =>{
        console.log('Login successful:', response);
       
        this.router.navigate(['/'])
        
      },
      error =>{
        console.error('Login failed:',error.message);
        this.loginError = error.message
      }
      )
    } else {
      console.log('Form is invalid');
    }
  }


  getErrorMessage(fieldName: string): string {
    const field = this.fields.find((f) => f.name === fieldName);
    if (field) {
      const control = this.loginForm.get(fieldName);
      if (control && control.errors) {
        const firstErrorType = Object.keys(control.errors)[0];
        const errorMessage = field.errors.find(
          (err) => err.type === firstErrorType
        )?.message;
        return errorMessage || '';
      }
    }
    return '';
  }
}
