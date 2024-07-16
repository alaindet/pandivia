import { WritableSignal } from '@angular/core';

import { StoreFeedback } from '@app/common/store';
import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { LOADING_STATUS, LoadingStatus } from '@app/common/types';

export function provideFeedback(
  uiFeature: UiStoreFeatureService,
  status: WritableSignal<LoadingStatus>,
): StoreFeedback {
  return {
    loader: {
      start: uiFeature.loading.start,
      stop: uiFeature.loading.stop,
    },
    status: {
      loading: () => status.set(LOADING_STATUS.LOADING),
      error: () => status.set(LOADING_STATUS.ERROR),
      success: () => status.set(LOADING_STATUS.IDLE),
    },
    notifier: {
      error: (message: string) => uiFeature.notifications.error(message),
      success: (message: string) => uiFeature.notifications.success(message),
    },
  };
}
