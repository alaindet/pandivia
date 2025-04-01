import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
} from 'rxjs';
import { getItemByName } from '@app/common/store';

import { ListStore } from '../store';

export function uniqueListItemNameValidator(
  listStore: ListStore,
  itemId: string | null
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return control.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      map((itemName) => {
        const existing = getItemByName(listStore.items(), itemName);
        const alreadyExists = existing !== null && existing.id !== itemId;

        if (alreadyExists) {
          return {
            // TODO: i18n
            uniqueItemName: `Item with name "${itemName}" already exists`,
          };
        }

        return null;
      }),
      first()
    );
  };
}
