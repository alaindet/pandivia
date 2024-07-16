import { finalize, Observable, Subscription } from 'rxjs';

export type StoreLoader = {
  start: () => void;
  stop: () => void;
};

export type StoreNotifier = {
  error: (message: string) => void;
  success: (message: string) => void;
};

export type StoreStatus = {
  loading: () => void;
  error: () => void;
  success: () => void;
};

export type StoreFeedback = {
  loader: StoreLoader;
  notifier: StoreNotifier;
  status: StoreStatus;
};

export type StoreUpdateOptions<T = any> = {
  source: Observable<T>;
  notifications: { ok: string | null; err: string | null } | null;
  onSuccess: ((data: T) => void) | null;
  loader: StoreLoader | null;
  notifier: StoreNotifier | null;
  status: StoreStatus | null;
};

export function updateStore<T = any>(
  source: Observable<T>,
  onSuccess?: (data: T) => void,
) {

  const options: StoreUpdateOptions = {
    source,
    notifications: null,
    onSuccess: onSuccess ?? null,
    loader: null,
    notifier: null,
    status: null,
  };

  return {
    withLoader(loader: StoreLoader) {
      options.loader = loader;
      return this;
    },
    withNotifier(notifier: StoreNotifier) {
      options.notifier = notifier;
      return this;
    },
    withStatus(status: StoreStatus) {
      options.status = status;
      return this;
    },
    withFeedback(feedback: StoreFeedback) {
      options.loader = feedback.loader;
      options.notifier = feedback.notifier;
      options.status = feedback.status;
      return this;
    },
    withNotifications(ok: string | null, err: string | null) {
      options.notifications = { ok, err };
      return this;
    },
    onSuccess(callback: (data: T) => void) {
      options.onSuccess = callback;
      return this;
    },
    update(): Subscription {
      const okMessage = options.notifications?.ok ?? null;
      const errMessage = options.notifications?.err ?? null;

      options.loader?.start();
      options.status?.loading();

      return options.source
        .pipe(finalize(() => options.loader?.stop()))
        .subscribe({
          error: err => {
            console.error(err);
            options.status?.error();
            if (errMessage) {
              options.notifier?.error(errMessage);
            }
          },
          next: data => {
            options.status?.success();

            if (options.onSuccess) {
              options.onSuccess(data);
            }

            if (okMessage) {
              options.notifier?.error(okMessage);
            }
          },
        });
    },
  };
}
