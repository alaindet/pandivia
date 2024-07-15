import { WritableSignal } from '@angular/core';
import { finalize, Subscription } from 'rxjs';

import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { LOADING_STATUS, LoadingStatus } from '@app/common/types';
import { StoreCollectionWriterSpec, StoreCommonFeedback } from './__types';
import { ListItem } from '../types';

export function updateStoreItemsAsync<T = any>(
  spec: StoreCollectionWriterSpec<T>,
): Subscription {

  let okMessage: string | null = null;
  let errMessage: string | null = null;

  if (spec.messages) {
    [okMessage, errMessage] = spec.messages;
  }

  spec.feedback.loader.start();
  spec.feedback.status.loading();

  return spec.source
    .pipe(finalize(() => spec.feedback.loader.stop()))
    .subscribe({
      error: err => {
        console.error(err);
        spec.feedback.status.error();
        if (errMessage) {
          spec.feedback.notifier.error(errMessage);
        }
      },
      next: data => {
        spec.feedback.status.success();
        spec.onSuccess(data);
        if (okMessage) {
          spec.feedback.notifier.error(okMessage);
        }
      },
    });
}

export function getStoreFeedback(
  uiFeature: UiStoreFeatureService,
  status: WritableSignal<LoadingStatus>,
): StoreCommonFeedback {
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

export function updateItem<T extends { id: string }>(
  items$: WritableSignal<T[]>,
  itemId: T['id'],
  updater: T | ((oldItem: T) => Partial<T>),
): void {
  items$.update(items => items.map(anItem => {
    if (anItem.id !== itemId) {
      return anItem;
    }

    if (typeof updater === 'function') {
      return { ...anItem, ...updater(anItem) };
    }

    return updater;
  }));
}
