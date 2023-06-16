import { NotificationType } from '@app/common/types';
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { selectNotification, selectNotificationsExist, uiNotificationsActions } from '../store';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private store = inject(Store);
  private transloco = inject(TranslocoService);

  current = this.store.selectSignal(selectNotification);
  exists = this.store.selectSignal(selectNotificationsExist);

  set(type: NotificationType, message: string) {
    switch (type) {
      case 'success':
        this.store.dispatch(uiNotificationsActions.addSuccess({ message }));
        break;
      case 'error':
        this.store.dispatch(uiNotificationsActions.addError({ message }));
        break;
    }
  }

  success(i18nPath: string, i18nParams?: Record<string, any>) {
    const message = this.transloco.translate(i18nPath, i18nParams);
    this.store.dispatch(uiNotificationsActions.addSuccess({ message }));
  }

  error(i18nPath: string, i18nParams?: Record<string, any>) {
    const message = this.transloco.translate(i18nPath, i18nParams);
    this.store.dispatch(uiNotificationsActions.addError({ message }));
  }

  dismiss() {
    this.store.dispatch(uiNotificationsActions.dismiss());
  }
}
