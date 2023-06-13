import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, first, map } from 'rxjs';
import { Store } from '@ngrx/store';

import { selectListItemExistsWithName } from '../store';

export function uniqueListItemNameValidator(
  store: Store,
  itemId: string | null,
): AsyncValidatorFn {

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const name = control.value;
    return store.select(selectListItemExistsWithName(name)).pipe(
      map(item => item !== null && item.id !== itemId),
      map(alreadyExists => alreadyExists ? err(name) : null),
      first(),
    );
  }
}

function err(name: string): ValidationErrors {
  return { uniqueItemName: `Item with name "${name}" already exists` };
}
