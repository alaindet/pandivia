import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap } from 'rxjs';

import { counterActions } from './actions';

@Injectable()
export class CounterEffects {

  private actions = inject(Actions);

  myEffect$ = createEffect(() => this.actions.pipe(
    ofType(counterActions.incrementByEffect),
    switchMap(() => of(counterActions.increment())),
    catchError(() => of(counterActions.decrement())),
  ));
}
