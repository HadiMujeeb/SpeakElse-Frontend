import { FormField } from '../models/form-field.model';

export const registerField: FormField[] = [
  {
    name: 'name',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter your username',
    errors: [
      { type: 'required', message: 'Username is required.' },
      {
        type: 'minlength',
        message: 'Username must be at least 3 characters long.',
      },
      { type: 'maxlength', message: 'Username cannot exceed 20 characters.' },
      { type: 'whitespace', message: 'Username cannot contain only spaces.' },
    ],
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email address',
    errors: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Please enter a valid email address.' },
      { type: 'whitespace', message: 'Email cannot contain only spaces.' },
    ],
  },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    placeholder: 'Select your country',
    options: [
      { value: 'United States', label: 'United States' },
      { value: 'India', label: 'India' },
      { value: 'United Kingdom', label: 'United Kingdom' },
      { value: 'Australia', label: 'Australia' },
    ],
    errors: [
      { type: 'required', message: 'Country is required.' },
      { type: 'whitespace', message: 'Country cannot contain only spaces.' },
    ],
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    placeholder: 'Enter your role',
    options: [
      { value: 'USER', label: 'User' },
      { value: 'ADMIN', label: 'Admin' },
      { value: 'MENTOR', label: 'Mentor' },
    ],
    errors: [
      { type: 'required', message: 'Role is required.' },
      { type: 'whitespace', message: 'Role cannot contain only spaces.' },
    ],
  },
  {
    name: 'profession',
    label: 'Profession',
    type: 'text',
    placeholder: 'Enter your profession',
    errors: [
      { type: 'required', message: 'Profession is required.' },
      { type: 'whitespace', message: 'Profession cannot contain only spaces.' },
    ],
  },
  {
    name: 'language',
    label: 'Language',
    type: 'text',
    placeholder: 'Enter your preferred language',
    errors: [
      { type: 'required', message: 'Language is required.' },
      { type: 'whitespace', message: 'Language cannot contain only spaces.' },
    ],
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter a brief description about yourself',
    errors: [
      { type: 'required', message: 'Description is required.' },
      { type: 'whitespace', message: 'Description cannot contain only spaces.' },
    ],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    errors: [
      { type: 'required', message: 'Password is required.' },
      {
        type: 'minlength',
        message: 'Password must be at least 8 characters long.',
      },
      {
        type: 'pattern',
        message:
          'Password must contain at least 1 uppercase and lowercase letter, 1 digit, and 1 special character.',
      },
      { type: 'whitespace', message: 'Password cannot contain only spaces.' },
    ],
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Re-enter your password',
    errors: [
      { type: 'required', message: 'Confirm Password is required.' },
      { type: 'mismatch', message: 'Passwords do not match.' },
      { type: 'whitespace', message: 'Confirm Password cannot contain only spaces.' },
    ],
  },
  {
    name: 'avatar',
    label: 'Profile Picture',
    type: 'file',
    placeholder: 'Upload your profile picture',
    errors: [
      { type: 'required', message: 'Profile picture is required.' },
      { type: 'fileType', message: 'Only image files (JPG, PNG) are allowed.' },
      { type: 'whitespace', message: 'Profile picture cannot contain only spaces.' },
    ],
  },
];
