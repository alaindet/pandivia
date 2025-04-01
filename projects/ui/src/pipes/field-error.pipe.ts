import { Pipe, PipeTransform } from '@angular/core';
import { FormControlDescriptor } from '@fixcommon/types';
import { fieldDescriptorHasError } from '@fixcommon/utils';

// myFormControl | appFieldError:'required'
// myFormControl | appFieldError:'minlength,maxlength'
@Pipe({
  name: 'appFieldError',
  pure: true,
})
export class FieldErrorPipe implements PipeTransform {
  transform(field: FormControlDescriptor, errorNames: string): boolean {
    if (!field.touched || !field.errors) {
      return false;
    }

    return fieldDescriptorHasError(field.errors, errorNames);
  }
}
