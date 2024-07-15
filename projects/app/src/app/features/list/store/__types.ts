import { Observable } from 'rxjs';

export type StoreLoader = {
  start: () => void;
  stop: () => void;
};

export type StoreStatus = {
  loading: () => void;
  error: () => void;
  success: () => void;
};

export type StoreNotifier = {
  error: (message: string) => void;
  success: (message: string) => void;
};

export type StoreCommonFeedback = {
  loader: StoreLoader;
  status: StoreStatus;
  notifier: StoreNotifier;
};

export type StoreCollectionWriterSpec<T = any> = {
  source: Observable<T>,
  feedback: StoreCommonFeedback;
  messages?: [string, string],
  onSuccess: (data: T) => void;
};
