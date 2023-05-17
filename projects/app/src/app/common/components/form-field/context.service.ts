import { Injectable, OnDestroy } from '@angular/core';
import { filterNull } from '@app/common/rxjs';

import { DataSource, OnceSource } from '@app/common/sources';
import { Observable } from 'rxjs';

@Injectable()
export class FormFieldContextService implements OnDestroy {

  private once = new OnceSource();
  private id$ = new DataSource<string | null>(null, this.once.event$);

  getId(): Observable<string> {
    return this.id$.data$.pipe(filterNull());
  }

  setId(id: string) {
    this.id$.next(id);
  }

  ngOnDestroy() {
    this.once.trigger();
  }
}