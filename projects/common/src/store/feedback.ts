import { WritableSignal } from '@angular/core';
import { HashMap } from '@jsverse/transloco';

import { LOADING_STATUS, LoadingStatus } from '../types';
import { StoreFeedback } from './update-store';

import { UiStore } from '@app/core/ui/store';

export function provideFeedback(
  uiStore: UiStore,
  status: WritableSignal<LoadingStatus>
): StoreFeedback {
  return {
    loader: {
      start: uiStore.loader.start,
      stop: uiStore.loader.stop,
    },
    status: {
      loading: () => status.set(LOADING_STATUS.LOADING),
      error: () => status.set(LOADING_STATUS.ERROR),
      success: () => status.set(LOADING_STATUS.IDLE),
    },
    notifier: {
      error: (message: string, params?: HashMap) => {
        uiStore.notifications.error(message, params);
      },
      success: (message: string, params?: HashMap) => {
        uiStore.notifications.success(message, params);
      },
    },
  };
}
