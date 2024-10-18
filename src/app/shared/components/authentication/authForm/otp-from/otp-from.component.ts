import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUserService } from '../../../../../core/services/user/auth-user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-otp-from',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './otp-from.component.html',
  styleUrls: ['./otp-from.component.css']
})
export class OtpFromComponent {
  // AuthServices = inject(AuthUserService);
  // otpForm!: FormGroup;    

  // constructor(
  //   private fb: FormBuilder,
  //   private router: Router,
  //   private route: ActivatedRoute // Inject ActivatedRoute
  // ) {
  //   this.otpForm = this.fb.group({
  //     digit1: ['', [Validators.required, Validators.maxLength(1)]],
  //     digit2: ['', [Validators.required, Validators.maxLength(1)]],
  //     digit3: ['', [Validators.required, Validators.maxLength(1)]],
  //     digit4: ['', [Validators.required, Validators.maxLength(1)]]
  //   });
  // }

  // onDigitInput(event: any) {
  //   let element;
  //   if (event.code !== 'Backspace') {
  //     element = event.srcElement.nextElementSibling;
  //   }

  //   if (event.code === 'Backspace') {
  //     element = event.srcElement.previousElementSibling;
  //   }

  //   if (element == null) return;
  //   else element.focus();
  // }

  // onSubmit() {
  //   if (this.otpForm.valid) {
  //     // Get the email from query parameters
  //     const email = this.route.snapshot.queryParamMap.get('email'); // Use ActivatedRoute to get the email
  //     if (email === null) {
  //       console.error('Email is null. Cannot verify OTP.');
  //       // Optionally, display an error message to the user
  //       return;
  //     }
  //     const enterotp = Object.values(this.otpForm.value).join('');
  //     const data ={enterotp,email}
  //     this.AuthServices.VerifyOtp(data).subscribe(
  //       (response) => {
  //         // Handle successful OTP verification response here
  //         console.log('OTP verified successfully:', response);
  //         this.router.navigate(['/'])
  //       },
  //       (error) => {
  //         // Handle error response here
  //         console.error('Error verifying OTP:', error);
  //       }
  //     );
  //     // Add any additional logic if needed
  //   } else {
  //     console.error('OTP form is invalid');
  //     // Optionally, display a message to the user
  //   }
  // }
}
