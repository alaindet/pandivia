import { computed, effect, inject, signal } from '@angular/core';

import {
  Notification,
  NOTIFICATION_TYPE,
  NotificationType,
  RuntimeNotification,
} from '@ui/components';

import { NOTIFICATION_TIMEOUT } from '../constants';
import { HashMap, TranslocoService } from '@jsverse/transloco';

export function createUiNotificationController() {
  const transloco = inject(TranslocoService);

  const notifications = signal<Notification[]>([]);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  function add(
    notifType: NotificationType,
    message: string,
    messageParams?: HashMap
  ) {
    const id = Date.now() + Math.random();
    const notif = {
      id,
      type: notifType,
      message: transloco.translate(message, messageParams),
    };
    notifications.update((notifs) => [...notifs, notif]);
  }

  function success(message: string, messageParams?: HashMap) {
    add(NOTIFICATION_TYPE.SUCCESS, message, messageParams);
  }

  function error(message: string, messageParams?: HashMap) {
    add(NOTIFICATION_TYPE.ERROR, message, messageParams);
  }

  function dismiss() {
    notifications.update((notifs) => notifs.slice(0, -1));
  }

  function init() {
    effect(() => {
      const notifs = notifications();

      if (!notifs.length) {
        return;
      }

      if (timeout !== null) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(dismiss, NOTIFICATION_TIMEOUT);
    });
  }

  function computeNotification(): RuntimeNotification | null {
    const notifs = notifications();

    if (!notifs.length) {
      return null;
    }

    return {
      ...notifs[notifs.length - 1],
      more: notifs.length - 1,
    };
  }

  return {
    notifications: notifications.asReadonly(),
    notification: computed(computeNotification),
    add,
    success,
    error,
    dismiss,
    init,
  };
}
