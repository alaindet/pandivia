import { FormControl, FormGroup } from '@angular/forms';

import { FormControlDescriptor } from '../../types/public-api';

export function getFieldDescriptor(
  form: FormGroup,
  fieldName: string
): FormControlDescriptor {
  const { value, touched, valid, errors } = form.get(fieldName)! as FormControl;
  return { value, touched, valid, errors };
}
