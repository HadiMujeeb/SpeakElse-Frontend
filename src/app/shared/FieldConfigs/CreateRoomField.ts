import { FormField } from '../models/form-field.interface';

export const CreateRoomField: FormField[] = [
  {
    name: 'topic',
    label: 'Topic',
    placeholder: 'Enter the topic',
    type: 'text',
    errors: [{ type: 'required', message: 'Topic is required' }],
  },
  {
    name: 'membersLimit',
    label: 'Members Limit',
    placeholder: 'Enter the maximum number of members',
    type: 'number',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
    ],
    errors: [
      { type: 'required', message: 'Members limit is required' },
      { type: 'min', message: 'Members limit must be at least 1' },
    ],
  },
  {
    name: 'language',
    label: 'Language',
    placeholder: 'Select the language',
    type: 'select',
    options: [
      { value: 'English', label: 'English' },
      { value: 'Spanish', label: 'Spanish' },
      { value: 'French', label: 'French' },
      { value: 'German', label: 'German' },
      { value: 'Mandarin', label: 'Mandarin' },
    ],
    errors: [{ type: 'required', message: 'Language is required' }],
  },
  {
    name: 'level',
    label: 'Level',
    placeholder: 'Select the room level',
    type: 'select',
    options: [
      { value: 'Beginner', label: 'Beginner' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Advanced', label: 'Advanced' },
    ],
    errors: [{ type: 'required', message: 'Level is required' }],
  },
  {
    name: 'privacy',
    label: 'Privacy',
    placeholder: 'Select room privacy setting',
    type: 'select',
    options: [
      { value: 'Public', label: 'Public' },
      { value: 'Private', label: 'Private' },
    ],
    errors: [{ type: 'required', message: 'Privacy setting is required' }],
  },
];
