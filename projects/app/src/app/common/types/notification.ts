import { ObjectValues } from './object-values';

export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type NotificationType = ObjectValues<typeof NOTIFICATION_TYPE>;

export type Notification = {
  id: number;
  type: NotificationType;
  message: string;
};

export type RuntimeNotification = Notification & {
  more: number; // Remaining notifications count
};

export const NOTIFICATION_POSITION = {
  TOP_RIGHT: 'top-right',
  // TODO: Add more...
} as const;

export type NotificationPosition = ObjectValues<typeof NOTIFICATION_POSITION>;
