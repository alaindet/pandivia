import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, first, map } from 'rxjs';

import { ListStoreFeatureService } from '../store';
import { toObservable } from '@angular/core/rxjs-interop';

export function uniqueListItemNameValidator(
  listStore: ListStoreFeatureService,
  itemId: string | null,
): AsyncValidatorFn {

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const name = control.value;
    return toObservable(listStore.itemExistsWithExactName(name)).pipe(
      map(item => item !== null && item.id !== itemId),
      map(alreadyExists => alreadyExists ? err(name) : null),
      first(),
    );
  }
}

function err(name: string): ValidationErrors {
  return { uniqueItemName: `Item with name "${name}" already exists` };
}
