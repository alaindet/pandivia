import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, timer, withLatestFrom } from 'rxjs';

import { NOTIFICATION_TIMEOUT } from '@app/core/constants';
import { notificationsActions } from './actions';
import { selectNotificationsExist } from './selectors';

@Injectable()
export class UiNotificationsEffects {

  private store = inject(Store);
  private actions = inject(Actions);

  autoDismiss$ = createEffect(() => this.actions.pipe(
    ofType(
      notificationsActions.addSuccess,
      notificationsActions.addError,
      notificationsActions.dismiss,
    ),
    withLatestFrom(this.store.select(selectNotificationsExist)),
    filter(([_, exist]) => exist),
    switchMap(() => timer(NOTIFICATION_TIMEOUT)), // <-- Wait here
    withLatestFrom(this.store.select(selectNotificationsExist)),
    filter(([_, exist]) => exist),
    map(() => notificationsActions.dismiss()),
  ));
}

export const UI_FEATURE_EFFECTS = [
  UiNotificationsEffects,
];
