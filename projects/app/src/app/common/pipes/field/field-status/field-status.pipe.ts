import { Pipe, PipeTransform } from '@angular/core';

import {
  FORM_FIELD_STATUS,
  FormFieldStatus,
  FormControlDescriptor,
} from '@app/common/types';

// myFormControl | appFieldStatus
@Pipe({
  name: 'appFieldStatus',
  pure: true,
})
export class FieldStatusPipe implements PipeTransform {
  transform(field: FormControlDescriptor): FormFieldStatus | undefined {
    if (!field.touched) {
      return undefined;
      // return FIELD_STATUS.NONE;
    }

    if (field.valid) {
      return FORM_FIELD_STATUS.SUCCESS;
    }

    return FORM_FIELD_STATUS.ERROR;
  }
}
