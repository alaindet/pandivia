import { BehaviorSubject, Observable, takeUntil } from 'rxjs';

import { OnceSource } from './once-source';

export type UpdaterFn<T> = (prev: T) => T;

/**
 * # Data Source
 *
 * This wraps a data source in a RxJS BehaviorSubject and exposes an API for
 * centralized reads and writes to the data source. Best suited for complex
 * nested components with services
 *
 * ## Usage
 * Best suited in services connecting multiple nested components, otherwise it's
 * total overkill
 *
 * ## Lifecycle
 * Lifecycle of the data source can be controlled directly or indirectly
 * - Indirect control requires you to pass a signal$ of type Observable<void> to
 *   the constructor, which will then be used as a trigger to shut down the
 *   data source
 * - Direct control requires no signal$, but you must call EventSource.destroy()
 *   whenever the data source must be shut down
 *
 * ## Example
 *
 * ```ts
 * @Component({
 *   selector: 'my-component',
 *   template: '<p>Open? {{ open.data$ | async ? 'YES' : 'NO' }}</p>',
 * })
 * class MyComponent implements OnInit, OnDestroy {
 *
 *   private once = new OnceSource();
 *
 *   open = new DataSource<boolean>(false);
 *   indirect1 = new DataSource<string>('Something worth it.', this.once.event$);
 *   indirect2 = new DataSource<number>(42, this.once.event$);
 *
 *   ngOnInit() {
 *     // Read data
 *     this.open.data$.subscribe(open => console.log('open', open));
 *
 *     // Set data based on previous data
 *     this.open.next(open => !open);
 *
 *     // Just override data
 *     this.open.next(false);
 *
 *     // Read data synchronously (not recommended)
 *     console.log('Current open', this.open.getCurrent());
 *   }
 *
 *   ngOnDestroy() {
 *     this.open.destroy(); // Direct lifecycle management
 *
 *     // This triggers indirect control on every controlled source
 *     // Here, this.indirect1 and this.indirect2
 *     this.once.trigger();
 *   }
 * }
 * ```
 */
 export class DataSource<T = any> {

  data$!: Observable<T>;

  private source$!: BehaviorSubject<T>;
  private _current!: T;
  private once?: OnceSource;

  constructor(initial: T, signal$?: Observable<void>) {
    this._current = initial;
    this.source$ = new BehaviorSubject<T>(this._current);

    if (!signal$) {
      this.once = new OnceSource();
      signal$ = this.once.event$;
    }

    signal$.subscribe(() => this.destroy());
    this.data$ = this.source$.asObservable().pipe(takeUntil(signal$));
  }

  destroy(): void {
    if (!this.once) return;
    this.once.trigger();
  }

  getSource(): BehaviorSubject<T> {
    return this.source$;
  }

  getCurrent(): T {
    return this._current;
  }

  /**
   * If passed a value, just updates the stream
   * If passed a function, calls the function passing it the previous value and
   * expecting the new value to be returned, then updates the stream with
   * returned value
   */
  next(updater: T | UpdaterFn<T>): void {
    if (typeof updater === 'function') {
      this._current = (updater as Function)(this.source$.getValue());
      this.source$.next(this._current);
    } else {
      this._current = updater;
      this.source$.next(updater);
    }
  }
}
