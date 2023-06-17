import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FIELD_STATUS, FieldStatus } from '@app/common/types';

// myFormControl | appFieldStatus
@Pipe({
  name: 'appFieldStatus',
  standalone: true,
  // pure: true,
})
export class FieldStatusPipe implements PipeTransform {
  transform(field: FormControl): FieldStatus | undefined {

    if (!field.touched) {
      return undefined;
      // return FIELD_STATUS.NONE;
    }

    if (field.valid) {
      return FIELD_STATUS.SUCCESS;
    }

    return FIELD_STATUS.ERROR;
  }
}