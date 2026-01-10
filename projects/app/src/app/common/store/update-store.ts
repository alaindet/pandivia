import { finalize, Observable, Subscription } from 'rxjs';

export type StoreLoader = {
  start: () => void;
  stop: () => void;
};

export type StoreNotifier = {
  error: (message: string, params?: Record<string, any>) => void;
  success: (message: string, params?: Record<string, any>) => void;
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
  notifications: {
    ok: string | [string, Record<string, any>] | null;
    err: string | [string, Record<string, any>] | null;
  } | null;
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
    withNotifications(
      ok: string | [string, Record<string, any>] | null,
      err: string | [string, Record<string, any>] | null,
    ) {
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

      const notify = (
        content: string | [string, Record<string, any>] | null,
        type: 'error' | 'success',
      ) => {

        if (!content) {
          return;
        }

        let message: string;
        let params: Record<string, any> | undefined = undefined;

        if (Array.isArray(content)) {
          message = content[0];
          params = content[1];
        } else {
          message = content;
        }

        switch (type) {
          case 'error':
            options.notifier?.error(message, params);    
            break;
          case 'success':
            options.notifier?.success(message, params);    
            break;
        }
      }

      return options.source
        .pipe(finalize(() => options.loader?.stop()))
        .subscribe({
          error: err => {
            console.error(err);
            options.status?.error();
            notify(errMessage, 'error');
          },
          next: data => {
            options.status?.success();

            if (options.onSuccess) {
              options.onSuccess(data);
            }

            notify(okMessage, 'success');
          },
        });
    },
  };
}
