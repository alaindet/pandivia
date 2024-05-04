import { EnumLike } from './enum-like';

export const MEDIA_QUERY_BREAKPOINT = {
  MOBILE: '600px',
  TABLET: '768px',
  DESKTOP: '1024px',
} as const;

export type MediaQueryBreakpoint = EnumLike<typeof MEDIA_QUERY_BREAKPOINT>;

export const MEDIA_QUERY_OPERATOR = {
  MIN_WIDTH: 'min-width',
  MAX_WIDTH: 'max-width',
} as const;

export type MediaQueryOperator = EnumLike<typeof MEDIA_QUERY_OPERATOR>;
