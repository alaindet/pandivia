import { Injectable, Signal, signal } from '@angular/core';
import { EnumLike } from '@common/types';

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

@Injectable()
export class MediaQueryService {
  private mediaQuerySubjects: Record<string, Signal<boolean>> = {};
  private mediaQueriesLists: Record<string, MediaQueryList> = {};

  getFromMobileDown(): Signal<boolean> {
    return this.getMediaQuery(
      MEDIA_QUERY_OPERATOR.MAX_WIDTH,
      MEDIA_QUERY_BREAKPOINT.MOBILE
    );
  }

  // Alias of getMediaQuery('max-width', '768px')
  getFromTabletDown(): Signal<boolean> {
    return this.getMediaQuery(
      MEDIA_QUERY_OPERATOR.MAX_WIDTH,
      MEDIA_QUERY_BREAKPOINT.TABLET
    );
  }

  getFromDesktopDown(): Signal<boolean> {
    return this.getMediaQuery(
      MEDIA_QUERY_OPERATOR.MAX_WIDTH,
      MEDIA_QUERY_BREAKPOINT.DESKTOP
    );
  }

  private getMediaQuery(
    operator: MediaQueryOperator,
    breakpoint: MediaQueryBreakpoint
  ): Signal<boolean> {
    const query = `(${operator}: ${breakpoint})`;

    if (!this.mediaQuerySubjects[query]) {
      this.initMediaQuery(query);
    }

    return this.mediaQuerySubjects[query];
  }

  private initMediaQuery(query: string): void {
    const mediaQueryList = window.matchMedia(query);
    const matches = mediaQueryList.matches;
    const mediaQuery$ = signal(matches);
    mediaQueryList.addEventListener('change', (e) =>
      mediaQuery$.set(e.matches)
    );
    this.mediaQueriesLists[query] = mediaQueryList;
    this.mediaQuerySubjects[query] = mediaQuery$.asReadonly();
  }
}
