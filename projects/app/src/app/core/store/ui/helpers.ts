import { createEffect, ofType } from '@ngrx/effects';
import { Observable, of, switchMap } from 'rxjs';

import { uiLoaderActions, uiNotificationsActions } from './actions';

export function createUiController(actions$: Observable<any>) {

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
      switchMap(() => of(uiLoaderActions.stop()))
    ));
  }

  function showErrorOn(...targetActions: any[]) {
    return createEffect(() => actions$.pipe(
      onActions(targetActions),
      switchMap(({ message }) => of(uiNotificationsActions.addError({ message })))
    ));
  }

  return {
    startLoaderOn,
    stopLoaderOn,
    showErrorOn,
  };
}
