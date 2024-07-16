import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, first, map } from 'rxjs';

import { InventoryStoreFeatureService } from '../store';

export function uniqueInventoryItemNameValidator(
  store: InventoryStoreFeatureService,
  itemId: string | null,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const name = control.value;
    return toObservable(store.itemExistsWithExactName(name)).pipe(
      map(item => item !== null && item.id !== itemId),
      map(alreadyExists => alreadyExists ? err(name) : null),
      first(),
    );
  }
}

function err(name: string): ValidationErrors {
  return { uniqueItemName: `Item with name "${name}" already exists` };
}
