import { Pipe, PipeTransform } from '@angular/core';

import { FormControlDescriptor } from '@app/common/types';
import { fieldDescriptorHasError } from '@app/common/utils';

// myFormControl | appFieldError:'required'
// myFormControl | appFieldError:'minlength,maxlength'
@Pipe({
  name: 'appFieldError',
  standalone: true,
  pure: true,
})
export class FieldErrorPipe implements PipeTransform {
  transform(
    field: FormControlDescriptor,
    errorNames: string,
  ): boolean {

    if (!field.touched || !field.errors) {
      return false;
    }

    return fieldDescriptorHasError(field.errors, errorNames);
  }
}