import { ObjectValues } from './object-values';

export const LOADING_STATUS = {
  PRISTINE: 'pristine',
  LOADING: 'loading',
  IDLE: 'idle',
  ERROR: 'error',
} as const;

export type LoadingStatus = ObjectValues<typeof LOADING_STATUS>;
