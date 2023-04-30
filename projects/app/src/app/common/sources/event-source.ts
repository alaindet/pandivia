import { Observable, Subject, takeUntil } from 'rxjs';

import { OnceSource } from './once-source';

/**
 * # Event source
 *
 * This wraps an event source in a RxJS Subject and exposes and API for
 * centralized reads and writes to the event Source.
 *
 * ## Usage
 * Best suited in services connecting multiple nested components, otherwise it's
 * total overkill
 *
 * ## Lifecycle
 * Lifecycle of the event source can be controlled directly or indirectly
 * - Indirect control requires you to pass a signal$ of type Observable<void> to
 *   the constructor, which will then be used as a trigger to shut down the
 *   event source
 * - Direct control requires no signal$, byt you must call EventSource.destroy()
 *   whenever the event source must be shut down
 *
 * ## Example
 *
 * ```ts
 * @Component({
 *   selector: 'my-component',
 *   template: `
 *     <div>
 *       <p>A or B?</p>
 *       <button (click)="onSelectA()">A</button>
 *       <button (click)="onSelectB()">B</button>
 *     </div>
 *   `,
 * })
 * class MyComponent implements OnInit, OnDestroy {
 *
 *   private once = new OnceSource();
 *
 *   @Output() selectedA = new EventEmitter<void>();
 *   @Output() selectedB = new EventEmitter<void>();
 *
 *   private selectAEvent = new EventSource(this.once.event$);
 *   private selectBEvent = new EventSource();
 *
 *   ngOnInit() {
 *     this.selectAEvent.event$.subscribe(e => this.selectedA.emit(e));
 *     this.selectBEvent.event$.subscribe(e => this.selectedB.emit(e));
 *   }
 *
 *   onSelectA() {
 *     this.selectAEvent.next();
 *   }
 *
 *   onSelectB() {
 *     this.selectBEvent.next();
 *   }
 *
 *   ngOnDestroy() {
 *     this.selectBEvent.destroy(); // Direct control
 *
 *     // This triggers indirect control on every controlled source
 *     // Here, this.indirect1 and this.indirect2
 *     this.once.trigger();
 *   }
 * }
 * ```
 */
export class EventSource<T = any> {

  event$: Observable<T>;

  private source$!: Subject<T>;
  private once?: OnceSource;

  constructor(signal$?: Observable<void>) {
    this.source$ = new Subject<T>();
    this.event$ = this.source$.asObservable();

    if (!signal$) {
      this.once = new OnceSource();
      signal$ = this.once.event$;
    }

    signal$.subscribe(() => this.destroy());
    this.event$ = this.source$.asObservable().pipe(takeUntil(signal$));
  }

  destroy(): void {
    if (!this.once) return;
    this.once.trigger();
  }

  next(eventData: T): void {
    this.source$.next(eventData);
  }
}
