import { createEffect, ofType } from '@ngrx/effects';
import { Observable, of, switchMap } from 'rxjs';

import { loaderActions, notificationsActions } from './actions';

export function createUiController(actions$: Observable<any>) {

  function onActions(targetActions: any[]) {
    return (source: Observable<any>) => {
      return source.pipe(ofType(...targetActions));
    };
  }

  function startLoaderOn(...targetActions: any[]) {
    return createEffect(() => actions$.pipe(
      onActions(targetActions),
      switchMap(() => of(loaderActions.start()))
    ));
  }
  
  function stopLoaderOn(...targetActions: any[]) {
    return createEffect(() => actions$.pipe(
      onActions(targetActions),
      switchMap(() => of(loaderActions.stop()))
    ));
  }
  
  function showErrorOn(...targetActions: any[]) {
    return createEffect(() => actions$.pipe(
      onActions(targetActions),
      switchMap(({ message }) => of(notificationsActions.addError({ message })))
    ));
  }

  return {
    startLoaderOn,
    stopLoaderOn,
    showErrorOn,
  };
}
