import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin/admin.service';
import { loginFields } from '../../../shared/FieldConfigs/login-form.config';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  private adminServices = inject(AdminService);
  loginForm!: FormGroup;
  fields = loginFields;
  loginError : string|null = null
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  onSubmit() {
   if (this.loginForm.valid){
    const { email, password } = this.loginForm.value;
    console.log('Admin Side', this.loginForm.value);
    this.adminServices.adminLogin(email, password).subscribe(
      (response) => { 
        console.log('Login successful:', response.admin);
        localStorage.setItem('adminToken', response.accessToken);
        this.router.navigate(['/admin/main/dashboard']);
      },
      (error) => { 
        console.log(error); 
          console.error('Login failed:', error.message);
          if (error.message === 'Invalid email.') {
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
