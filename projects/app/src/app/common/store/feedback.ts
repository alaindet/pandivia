import { WritableSignal } from '@angular/core';

import { StoreFeedback } from '@app/common/store';
import { UiStore } from '@app/core/ui/store';
import { LOADING_STATUS, LoadingStatus } from '@app/common/types';

export function provideFeedback(
  uiStore: UiStore,
  status: WritableSignal<LoadingStatus>,
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
      error: (message: string) => uiStore.notifications.error(message),
      success: (message: string) => uiStore.notifications.success(message),
    },
  };
}
