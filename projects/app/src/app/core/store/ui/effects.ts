import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Title } from '@angular/platform-browser';
import { filter, map, switchMap, tap, timer, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import { NOTIFICATION_TIMEOUT } from '@app/core/ui';
import { selectNotificationsExist } from './selectors';
import { uiNotificationAddSuccess, uiNotificationAddError, uiNotificationDismiss, uiSetPageTitle } from './actions';

@Injectable()
export class UiNotificationsEffects {

  private store = inject(Store);
  private actions = inject(Actions);
  private title = inject(Title);

  autoDismiss$ = createEffect(() => this.actions.pipe(
    ofType(
      uiNotificationAddSuccess,
      uiNotificationAddError,
      uiNotificationDismiss,
    ),
    withLatestFrom(this.store.select(selectNotificationsExist)),
    filter(([_, exist]) => exist),
    switchMap(() => timer(NOTIFICATION_TIMEOUT)), // <-- Wait here
    withLatestFrom(this.store.select(selectNotificationsExist)),
    filter(([_, exist]) => exist),
    map(() => uiNotificationDismiss()),
  ));

  pageTitle$ = createEffect(() => this.actions.pipe(
    ofType(uiSetPageTitle),
    tap(action => this.title.setTitle(action.title)),
  ), { dispatch: false });
}

export const UI_FEATURE_EFFECTS = [
  UiNotificationsEffects,
];
