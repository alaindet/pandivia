import { finalize, Observable, Subscription } from 'rxjs';

export type CollectionLoader = {
  start: () => void;
  stop: () => void;
};

export type CollectionNotifier = {
  error: (message: string) => void;
  success: (message: string) => void;
};

export type CollectionStatus = {
  loading: () => void;
  error: () => void;
  success: () => void;
};

export type CollectionFeedback = {
  loader: CollectionLoader;
  notifier: CollectionNotifier;
  status: CollectionStatus;
};

export type CollectionUpdateOptions<T = any> = {
  source: Observable<T>;
  notifications: { ok: string; err: string } | null;
  onSuccess: ((data: T) => void) | null;
  loader: CollectionLoader | null;
  notifier: CollectionNotifier | null;
  status: CollectionStatus | null;
};

export function updateCollection<T = any>(
  source: Observable<T>,
  onSuccess?: (data: T) => void,
) {

  const options: CollectionUpdateOptions = {
    source,
    notifications: null,
    onSuccess: onSuccess ?? null,
    loader: null,
    notifier: null,
    status: null,
  };

  return {
    withLoader(loader: CollectionLoader) {
      options.loader = loader;
      return this;
    },
    withNotifier(notifier: CollectionNotifier) {
      options.notifier = notifier;
      return this;
    },
    withStatus(status: CollectionStatus) {
      options.status = status;
      return this;
    },
    withFeedback(feedback: CollectionFeedback) {
      options.loader = feedback.loader;
      options.notifier = feedback.notifier;
      options.status = feedback.status;
      return this;
    },
    withNotifications(ok: string, err: string) {
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
