import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const counterActions = createActionGroup({
  source: 'Counter',
  events: {
    'Decrement': emptyProps(),
    'Increment': emptyProps(),
    'Decrement by amount': props<{ amount: number }>(),
    'Increment by amount': props<{ amount: number }>(),
    'Increment by effect': emptyProps(),
  },
});
