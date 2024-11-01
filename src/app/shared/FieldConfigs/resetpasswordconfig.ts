import { FormField } from '../models/form-field.interface';

export const resetPasswordField: FormField[] = [
  {
    name: 'newPassword',
    label: 'New Password',
    type: 'password',
    placeholder: 'Enter your new password',
    errors: [
      { type: 'required', message: 'New Password is required.' },
      {
        type: 'minlength',
        message: 'New Password must be at least 8 characters long.',
      },
      {
        type: 'pattern',
        message:
          'New Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      },
    ],
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Re-enter your new password',
    errors: [
      { type: 'required', message: 'Confirm Password is required.' },
      { type: 'mismatch', message: 'Passwords do not match.' },
    ],
  },
];

export const resetEmail: FormField[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your registered email address',
    errors: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Please enter a valid email address.' },
    ],
  },
];
