import { EnumLike } from './enum-like';

export const LOADING_STATUS = {
  PRISTINE: 'pristine',
  LOADING: 'loading',
  IDLE: 'idle',
  ERROR: 'error',
} as const;

export type LoadingStatus = EnumLike<typeof LOADING_STATUS>;
