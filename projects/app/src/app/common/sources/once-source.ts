import { Observable, Subject, takeUntil } from 'rxjs';

export class OnceSource {

  event$: Observable<void>;

  private source$!: Subject<void>;

  constructor() {
    this.source$ = new Subject<void>();
    this.event$ = this.source$.asObservable().pipe(takeUntil(this.source$));
  }

  trigger(): void {
    this.source$.next();
    this.source$.complete();
  }
}
