import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { ListService } from '../../services';
import { listCompleteItem, listCreateItem, listDecrementItem, listEditItem, listIncrementItem, listRemoveItem, listToggleItem, listUndoItem } from '../actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class ListItemEffects {

  private actions = inject(Actions);
  private svc = inject(ListService).item;

  create$ = createEffect(() => this.actions.pipe(
    ofType(listCreateItem.try),
    switchMap(({ dto }) => this.svc.create(dto).pipe(
      map(item => {
        const message = 'common.async.createItemSuccess';
        return listCreateItem.ok({ item, message });
      }),
      catchError(() => {
        const message = 'common.async.createItemError';
        return of(listCreateItem.err({ message }));
      }),
    )),
  ));

  edit$ = createEffect(() => this.actions.pipe(
    ofType(listEditItem.try),
    switchMap(({ item }) => this.svc.edit(item).pipe(
      map(item => {
        const message = 'common.async.editItemSuccess';
        return listEditItem.ok({ item, message });
      }),
      catchError(() => {
        const message = 'common.async.editItemError';
        return of(listEditItem.err({ message }));
      }),
    )),
  ));

  complete$ = createEffect(() => this.actions.pipe(
    ofType(listCompleteItem.try),
    switchMap(({ item }) => this.svc.complete(item.id).pipe(
      map(item => listCompleteItem.ok({ item, message: 'nope' })),
      catchError(() => of(listCompleteItem.err({ message: 'nope' }))),
    )),
  ));

  undo$ = createEffect(() => this.actions.pipe(
    ofType(listUndoItem.try),
    switchMap(({ item }) => this.svc.undo(item.id).pipe(
      map(item => listUndoItem.ok({ item, message: 'nope' })),
      catchError(() => of(listUndoItem.err({ message: 'nope' }))),
    )),
  ));

  toggle$ = createEffect(() => this.actions.pipe(
    ofType(listToggleItem.try),
    switchMap(({ item }) => this.svc.toggle(item.id).pipe(
      map(item => listToggleItem.ok({ item, message: 'nope' })),
      catchError(() => of(listToggleItem.err({ message: 'nope' }))),
    )),
  ));

  increment$ = createEffect(() => this.actions.pipe(
    ofType(listIncrementItem.try),
    switchMap(({ item }) => this.svc.increment(item.id).pipe(
      map(item => listIncrementItem.ok({ item, message: 'nope' })),
      catchError(() => of(listIncrementItem.err({ message: 'nope' }))),
    )),
  ));

  decrement$ = createEffect(() => this.actions.pipe(
    ofType(listDecrementItem.try),
    switchMap(({ item }) => this.svc.decrement(item.id).pipe(
      map(item => listDecrementItem.ok({ item, message: 'nope' })),
      catchError(() => of(listDecrementItem.err({ message: 'nope' }))),
    )),
  ));

  remove$ = createEffect(() => this.actions.pipe(
    ofType(listRemoveItem.try),
    switchMap(({ itemId }) => this.svc.remove(itemId).pipe(
      map(() => {
        const message = 'common.async.removeItemSuccess';
        return listRemoveItem.ok({ itemId, message });
      }),
      catchError(() => {
        const message = 'common.async.removeItemError';
        return of(listRemoveItem.err({ message }));
      }),
    )),
  ));
}
