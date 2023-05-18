import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { counterActions, selectCounter } from './store';

const IMPORTS = [
  AsyncPipe,
];

@Component({
  selector: 'app-counter-page',
  standalone: true,
  imports: IMPORTS,
  template: `
    <button type="button" (click)="onDecrement()">-1</button>
    <button type="button" (click)="onDecrementByFive()">-5</button>
    <button type="button" (click)="onIncrement()">+1</button>
    <button type="button" (click)="onIncrementByTen()">+10</button>
    <button type="button" (click)="onIncrementByTen()">+10</button>
    <button type="button" (click)="onIncrementByEffect()">+1 by effect</button>

    <p>Counter: {{ counter$ | async }}</p>
  `,
})
export class CounterPageComponent {

  store = inject(Store);
  counter$ = this.store.select(selectCounter);

  onDecrement() {
    this.store.dispatch(counterActions.decrement());
  }

  onDecrementByFive() {
    this.store.dispatch(counterActions.decrementByAmount({ amount: 5 }));
  }

  onIncrement() {
    this.store.dispatch(counterActions.increment());
  }

  onIncrementByTen() {
    this.store.dispatch(counterActions.incrementByAmount({ amount: 10 }));
  }

  onIncrementByEffect() {
    this.store.dispatch(counterActions.incrementByEffect());
  }
}
