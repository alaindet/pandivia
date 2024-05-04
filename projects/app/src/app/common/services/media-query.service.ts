import { Injectable, Signal, signal } from '@angular/core';

import { MEDIA_QUERY_BREAKPOINT, MEDIA_QUERY_OPERATOR, MediaQueryBreakpoint, MediaQueryOperator } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService {

  private mediaQuerySubjects: Record<string, Signal<boolean>> = {};
	private mediaQueriesLists: Record<string, MediaQueryList> = {};

	getFromMobileDown(): Signal<boolean> {
		return this.getMediaQuery(
      MEDIA_QUERY_OPERATOR.MAX_WIDTH,
			MEDIA_QUERY_BREAKPOINT.MOBILE,
		);
	}

	// Alias of getMediaQuery('max-width', '768px')
	getFromTabletDown(): Signal<boolean> {
		return this.getMediaQuery(
			MEDIA_QUERY_OPERATOR.MAX_WIDTH,
			MEDIA_QUERY_BREAKPOINT.TABLET,
		);
	}

	getFromDesktopDown(): Signal<boolean> {
		return this.getMediaQuery(
			MEDIA_QUERY_OPERATOR.MAX_WIDTH,
      MEDIA_QUERY_BREAKPOINT.DESKTOP,
		);
	}

  private getMediaQuery(
		operator: MediaQueryOperator,
		breakpoint: MediaQueryBreakpoint,
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
		mediaQueryList.addEventListener('change', e => mediaQuery$.set(e.matches));
		this.mediaQueriesLists[query] = mediaQueryList;
		this.mediaQuerySubjects[query] = mediaQuery$.asReadonly();
	}
}
