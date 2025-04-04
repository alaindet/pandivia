import { EnumLike } from '@common/types';

export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type NotificationType = EnumLike<typeof NOTIFICATION_TYPE>;

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

export type NotificationPosition = EnumLike<typeof NOTIFICATION_POSITION>;
