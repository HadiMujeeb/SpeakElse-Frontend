import { FormField } from '../models/form-field.interface';

export const mentorApplicationFields: FormField[] = [
  {
    name: 'name',
    label: 'username',
    type: 'text',
    placeholder: 'First Name',
    errors: [{ type: 'required', message: 'First Name is required.' }],
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Email Address',
    errors: [
      { type: 'required', message: 'Email address is required.' },
      { type: 'email', message: 'Enter a valid email address.' },
    ],
  },
  {
    name: 'country',
    label: 'Country',
    type: 'text',
    placeholder: 'Country',
    errors: [{ type: 'required', message: 'Country is required.' }],
  },
  {
    name: 'position',
    label: 'Position Applying For',
    type: 'text',
    placeholder: 'Position',
    errors: [{ type: 'required', message: 'Position is required.' }],
  },
  {
    name: 'motivationLetter',
    label: 'Motivation Letter',
    type: 'textarea',
    placeholder: 'Write your motivation letter here',
    errors: [{ type: 'required', message: 'Motivation letter is required.' }],
  },
  {
    name: 'cvFile',
    label: 'Upload CV',
    type: 'file',
    placeholder: 'Upload your CV',
    errors: [{ type: 'required', message: 'CV file is required.' }],
  },
];
