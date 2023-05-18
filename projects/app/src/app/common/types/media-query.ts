import { ObjectValues } from './object-values';

export const MEDIA_QUERY_BREAKPOINT = {
  MOBILE: '600px',
  TABLET: '768px',
  DESKTOP: '1024px',
} as const;

export type MediaQueryBreakpoint = ObjectValues<typeof MEDIA_QUERY_BREAKPOINT>;

export const MEDIA_QUERY_OPERATOR = {
  MIN_WIDTH: 'min-width',
  MAX_WIDTH: 'max-width',
} as const;

export type MediaQueryOperator = ObjectValues<typeof MEDIA_QUERY_OPERATOR>;
