import { FormField } from '../models/form-field.model';

export const loginFields: FormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    errors: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Enter a valid email.' },
      { type: 'notExist', message: 'Email does not exist.' },
    ],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    errors: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Must be at least 6 characters.' },
      {
        type: 'strongPassword',
        message: 'Use uppercase, lowercase, number, and symbol.',
      },
      { type: 'incorrect', message: 'Incorrect password.' },
    ],
  },
];
