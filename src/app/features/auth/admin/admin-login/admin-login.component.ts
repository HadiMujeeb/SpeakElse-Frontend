import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  adminSerivices = inject(AdminService);

  loginForm!: FormGroup;

  constructor(db: FormBuilder, private router: Router) {
    this.loginForm = db.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    console.log('Admin Side', this.loginForm.value);

    this.adminSerivices.adminLogin(email, password).subscribe({
      next: (response) => {
        // Handle successful login
        console.log('Login successful:', response);
        localStorage.setItem('adminToken',response.accessToken)
        this.router.navigate(['/admin/member']);
      },
      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }
}
