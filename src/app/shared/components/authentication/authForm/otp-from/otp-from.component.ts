import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-from',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './otp-from.component.html',
  styleUrl: './otp-from.component.css'
})
export class OtpFromComponent {
  otpForm!: FormGroup;    
  
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.maxLength(1)]],
      digit2: ['', [Validators.required, Validators.maxLength(1)]],
      digit3: ['', [Validators.required, Validators.maxLength(1)]],
      digit4: ['', [Validators.required, Validators.maxLength(1)]]
    });
  }

  onDigitInput(event: any) {
    let element;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;

    if (element == null)
      return;
    else
      element.focus();
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      console.log('Submitted OTP:', otp);
      // Add your OTP verification logic here
    }
  }
}

