import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isInvalid = isWhitespace && control.value.length > 0;
  return isInvalid ? { whitespace: true } : null;
}
