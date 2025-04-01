import { FormControl } from '@angular/forms';

export type FormControlDescriptor = Pick<FormControl, (
  | 'value'
  | 'touched'
  | 'valid'
  | 'errors'
)>;