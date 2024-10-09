import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthUserService } from '../../../../../core/services/user/auth-user.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {

  authUserServices = inject(AuthUserService)


  registrationForm!: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.mustMatch('password', 'confirmPassword') // Use `validators` instead of `validator`
    });
  }

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (confirmPassControl.errors && !confirmPassControl.errors['mustMatch']) {
        return;
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mustMatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    this.submitted = true;

    // if (this.registrationForm.invalid) {
    //   return;
    // }

    // Call the registration service
    this.authUserServices.RegisterationRequest(this.registrationForm.value).subscribe(
      response => {
        // Handle successful registration here
        console.log(response);
        const email = this.registrationForm.value.email
        this.router.navigate(['/auth/otp'],{queryParams:{email}});
      },
      error => {
        // console.error("Registration failed", error); // Logs: Registration failed Error: Email already exists
        console.log(error)
        if (error.message === 'Email already exists') {
          this.registrationForm.controls['email'].setErrors({ emailExists: true });
        } else {
          // Handle other types of errors
        }
      }
    );
  }
}  
