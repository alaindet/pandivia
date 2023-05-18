import { Injectable, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { DataSource, OnceSource } from '../sources';
import { MEDIA_QUERY_BREAKPOINT, MEDIA_QUERY_OPERATOR, MediaQueryBreakpoint, MediaQueryOperator } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService implements OnDestroy {

  private once = new OnceSource();

  ngOnDestroy() {
    this.once.trigger();
  }

  private mediaQuerySubjects: { [key: string]: DataSource<boolean> } = {};
	private mediaQueriesLists: { [key: string]: MediaQueryList } = {};

	getFromMobileDown(): Observable<boolean> {
		return this.getMediaQuery(
      MEDIA_QUERY_OPERATOR.MAX_WIDTH,
			MEDIA_QUERY_BREAKPOINT.MOBILE,
		);
	}

	// Alias of getMediaQuery('max-width', '768px')
	getFromTabletDown(): Observable<boolean> {
		return this.getMediaQuery(
			MEDIA_QUERY_OPERATOR.MAX_WIDTH,
			MEDIA_QUERY_BREAKPOINT.TABLET,
		);
	}

	getFromDesktopDown(): Observable<boolean> {
		return this.getMediaQuery(
			MEDIA_QUERY_OPERATOR.MAX_WIDTH,
      MEDIA_QUERY_BREAKPOINT.DESKTOP,
		);
	}

  private getMediaQuery(
		operator: MediaQueryOperator,
		breakpoint: MediaQueryBreakpoint,
	): Observable<boolean> {

    const query = `(${operator}: ${breakpoint})`;

		if (!this.mediaQuerySubjects[query]) {

			// Init media query
			const mediaQueryList = window.matchMedia(query);
			const matches = mediaQueryList.matches;

			// Init data source
			const mediaQuery$ = new DataSource<boolean>(matches, this.once.event$);
			mediaQueryList.addEventListener('change', e => mediaQuery$.next(e.matches));

      this.mediaQueriesLists[query] = mediaQueryList;
      this.mediaQuerySubjects[query] = mediaQuery$;
		}

		return this.mediaQuerySubjects[query].data$;
	}
}
