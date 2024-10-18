import { FormField } from '../../../models/user/form-field.interface';

export const registerField: FormField[] = [
    {
    name: 'name',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter your username',
    errors: [
        { type: 'required', message: 'Username is required.' },
        { type: 'minlength', message: 'Username must be at least 3 characters long.' },
        { type: 'maxlength', message: 'Username cannot exceed 20 characters.' },
    ],
},  
{
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email address',
    errors: [
        { type: 'required', message: 'Email is required.' },
        { type: 'email', message: 'Please enter a valid email address.' }
    ],
},
{
    name: 'country',
    label: 'Country',
    type: 'select', 
    placeholder: 'Select your country',
    errors: [
        { type: 'required', message: 'Country is required.' }
    ],
},
{
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    errors: [
        { type: 'required', message: 'Password is required.' },
        { type: 'minlength', message: 'Password must be at least 8 characters long.' },
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
    ],
}
]