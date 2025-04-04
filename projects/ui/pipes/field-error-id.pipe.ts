import { Pipe, PipeTransform } from '@angular/core';
import { fieldDescriptorHasError } from '@common/utils';
import { FormControlDescriptor } from '@common/types';

// myFormControl | appFieldErrorId:{
//   'required': 'item-name-required',
//   'minlength,maxlength': 'item-name-length',
//   'unique': 'item-name-unique',
// }
@Pipe({
  name: 'appFieldErrorId',
  pure: true,
})
export class FieldErrorIdPipe implements PipeTransform {
  transform(
    field: FormControlDescriptor,
    spec: { [errorNames: string]: string }
  ): string | null {
    if (!field.touched || !field.errors) {
      return null;
    }

    for (const errorNames in spec) {
      const hasError = fieldDescriptorHasError(field.errors, errorNames);
      if (hasError) {
        return spec[errorNames];
      }
    }

    return null;
  }
}
