import { createEffect, ofType } from '@ngrx/effects';
import { Observable, of, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { uiLoaderActions, uiNotificationsActions } from './actions';

export function createUiController(
  actions$: Observable<any>,
  transloco: TranslocoService,
) {

  function onActions(targetActions: any[]) {
    return (source: Observable<any>) => {
      return source.pipe(ofType(...targetActions));
    };
  }

  function startLoaderOn(...targetActions: any[]) {
    return createEffect(() => actions$.pipe(
      onActions(targetActions),
      switchMap(() => of(uiLoaderActions.start()))
    ));
  }

  function stopLoaderOn(...targetActions: any[]) {
    return createEffect(() => actions$.pipe(
      onActions(targetActions),
      switchMap(() => of(uiLoaderActions.stop())),
    ));
  }

  function showErrorOn(...targetActions: any[]) {
    return createEffect(() => actions$.pipe(
      onActions(targetActions),
      switchMap(action => {
        const message = transloco.translate(action.message);
        return of(uiNotificationsActions.addError({ message }));
      }),
    ));
  }

  function showSuccessOn(...targetActions: any[]) {
    return createEffect(() => actions$.pipe(
      onActions(targetActions),
      switchMap(action => {
        const message = transloco.translate(action.message);
        return of(uiNotificationsActions.addSuccess({ message }));
      }),
    ));
  }

  return {
    startLoaderOn,
    stopLoaderOn,
    showErrorOn,
    showSuccessOn,
  };
}
