import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { selectNotification, selectNotificationsExist, uiNotificationAddError, uiNotificationAddSuccess, uiNotificationDismiss } from '../store';

export function createNotificationController() {

  const store = inject(Store);
  const transloco = inject(TranslocoService);

  const current = store.selectSignal(selectNotification);
  const exists = store.selectSignal(selectNotificationsExist);

  function ok(i18nPath: string, i18nParams ?: Record<string, any>) {
    const message = transloco.translate(i18nPath, i18nParams);
    store.dispatch(uiNotificationAddSuccess({ message }));
  }

  function err(i18nPath: string, i18nParams ?: Record<string, any>) {
    const message = transloco.translate(i18nPath, i18nParams);
    store.dispatch(uiNotificationAddError({ message }));
  }

  function dismiss() {
    store.dispatch(uiNotificationDismiss());
  }

  return {
    current,
    exists,

    ok,
    err,
    dismiss,
  };
}
