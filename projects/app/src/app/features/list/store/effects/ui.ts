import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { TranslocoService } from '@ngneat/transloco';

import { createUiController } from '@app/core/ui';
import { listCompleteItem, listCompleteItems, listCompleteItemsByCategory, listCreateItem, listDecrementItem, listEditItem, listFetchItems, listIncrementItem, listRemoveCompletedItems, listRemoveCompletedItemsByCategory, listRemoveItem, listRemoveItems, listRemoveItemsByCategory, listToggleItem, listUndoItem, listUndoItems, listUndoItemsByCategory } from '../actions';

@Injectable()
export class ListUiEffects {

  private actions = inject(Actions);
  private transloco = inject(TranslocoService);
  private ui = createUiController(this.actions, this.transloco);

  startLoader$ = this.ui.startLoaderOn(

    // All items
    ...[listFetchItems.try, listFetchItems.force],
    listCompleteItems.try,
    listUndoItems.try,
    listRemoveItems.try,
    listRemoveCompletedItems.try,

    // Category
    listCompleteItemsByCategory.try,
    listUndoItemsByCategory.try,
    listRemoveCompletedItemsByCategory.try,
    listRemoveItemsByCategory.try,

    // Item
    listCreateItem.try,
    listEditItem.try,
    listCompleteItem.try,
    listUndoItem.try,
    listToggleItem.try,
    listIncrementItem.try,
    listDecrementItem.try,
    listRemoveItem.try,
  );

  stopLoader$ = this.ui.stopLoaderOn(

    // All items
    ...[listFetchItems.ok, listFetchItems.cached, listFetchItems.err],
    ...[listCompleteItems.ok, listCompleteItems.err],
    ...[listUndoItems.ok, listUndoItems.err],
    ...[listRemoveItems.ok, listRemoveItems.err],
    ...[listRemoveCompletedItems.ok, listRemoveCompletedItems.err],

    // Category
    ...[listCompleteItemsByCategory.ok, listCompleteItemsByCategory.err],
    ...[listUndoItemsByCategory.ok, listUndoItemsByCategory.err],
    ...[listRemoveCompletedItemsByCategory.ok, listRemoveCompletedItemsByCategory.err],
    ...[listRemoveItemsByCategory.ok, listRemoveItemsByCategory.err],

    // Item
    ...[listCreateItem.ok, listCreateItem.err],
    ...[listEditItem.ok, listEditItem.err],
    ...[listCompleteItem.ok, listCompleteItem.err],
    ...[listUndoItem.ok, listUndoItem.err],
    ...[listToggleItem.ok, listToggleItem.err],
    ...[listIncrementItem.ok, listIncrementItem.err],
    ...[listDecrementItem.ok, listDecrementItem.err],
    ...[listRemoveItem.ok, listRemoveItem.err],
  );

  showSuccessOn$ = this.ui.showSuccessOn(

    // All items
    listRemoveItems.ok,
    listRemoveCompletedItems.ok,

    // Category
    listRemoveCompletedItemsByCategory.ok,
    listRemoveItemsByCategory.ok,

    // Item
    listCreateItem.ok,
    listEditItem.ok,
    listRemoveItem.ok,
  );

  showError$ = this.ui.showErrorOn(

    // All items
    listFetchItems.err,
    listCompleteItems.err,
    listUndoItems.err,
    listRemoveItems.err,
    listRemoveCompletedItems.err,

    // Category
    listCompleteItemsByCategory.err,
    listUndoItemsByCategory.err,
    listRemoveCompletedItemsByCategory.err,
    listRemoveItemsByCategory.err,

    // Item
    listCreateItem.err,
    listEditItem.err,
    listCompleteItem.err,
    listUndoItem.err,
    listToggleItem.err,
    listIncrementItem.err,
    listDecrementItem.err,
    listRemoveItem.err,
  );
}
