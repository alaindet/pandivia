import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';

import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, CardListComponent, ItemActionOutput, ItemToggledOutput, ModalService } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { CategorizedListItems, ListItem } from '@app/core';
import { NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { Observable, combineLatest, of, startWith, switchMap, take, throwError } from 'rxjs';
import { inventoryItemActions } from '../inventory/store';
import * as categoryMenuAction from './category.contextual-menu';
import { ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput } from './components/confirm-prompt-modal';
import { CreateItemFormModalOutput, ItemFormModalComponent, ItemFormModalInput, ItemFormModalOutput } from './components/item-form-modal';
import { CATEGORY_REMOVE_COMPLETED_PROMPT, CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_COMPLETED_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import * as itemMenuAction from './item.contextual-menu';
import * as listMenuAction from './list.contextual-menu';
import { listAllItemsActions, listCategoryActions, listItemsAsyncReadActions, listFilterActions, listItemActions, selectItemAmount, selectItemById, selectListCategorizedFilteredItems, selectListCategoryFilter, selectListFilters, selectListIsDoneFilter } from './store';
import { ListFilterToken } from './types';

const IMPORTS = [
  NgIf,
  NgFor,
  AsyncPipe,
  CardListComponent,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListPageComponent implements OnInit {

  private store = inject(Store);
  private layout = inject(StackedLayoutService);
  private modal = inject(ModalService);

  CATEGORY_CONTEXTUAL_MENU = categoryMenuAction.CATEGORY_CONTEXTUAL_MENU;
  getItemContextualMenu = itemMenuAction.getItemContextualMenu;
  // getListContextualMenu = listMenuAction.getListContextualMenu;

  vm$ = combineLatest({
    itemGroups: this.store.select(selectListCategorizedFilteredItems),
    filters: this.store.select(selectListFilters),
    pinnedCategory: this.store.select(selectListCategoryFilter),
  }).pipe(startWith(null));

  ngOnInit() {
    this.initPageMetadata();
    this.initHeaderActions();
    this.store.dispatch(listItemsAsyncReadActions.fetchItems());
  }

  onListAction(action: string) {
    switch (action) {
      case listMenuAction.LIST_ACTION_REFRESH.id:
        this.store.dispatch(listItemsAsyncReadActions.forceFetchItems());
        break;
      case listMenuAction.LIST_ACTION_COMPLETE.id:
        this.store.dispatch(listAllItemsActions.complete());
        break;
      case listMenuAction.LIST_ACTION_HIDE_COMPLETED.id:
        this.store.dispatch(listFilterActions.setDoneFilter({ isDone: true }));
        break;
      case listMenuAction.LIST_ACTION_SHOW_COMPLETED.id:
        this.store.dispatch(listFilterActions.clearDoneFilter());
        break;
      case listMenuAction.LIST_ACTION_UNDO.id:
        this.store.dispatch(listAllItemsActions.undo());
        break;
      case listMenuAction.LIST_ACTION_REMOVE_COMPLETED.id:
        this.confirmPrompt(LIST_REMOVE_COMPLETED_PROMPT).subscribe(() => {
          this.store.dispatch(listAllItemsActions.removeCompleted());
        });
        break;
      case listMenuAction.LIST_ACTION_REMOVE.id:
        this.confirmPrompt(LIST_REMOVE_PROMPT).subscribe(() => {
          this.store.dispatch(listAllItemsActions.remove());
        });
        break;
    }
  }

  onCategoryAction(category: string, action: string) {
    switch (action) {
      case categoryMenuAction.CATEGORY_ACTION_COMPLETE.id:
        this.store.dispatch(listCategoryActions.complete({ category }));
        break;
      case categoryMenuAction.CATEGORY_ACTION_UNDO.id:
        this.store.dispatch(listCategoryActions.undo({ category }));
        break;
      case categoryMenuAction.CATEGORY_ACTION_REMOVE_COMPLETED.id:
        this.confirmPrompt(CATEGORY_REMOVE_COMPLETED_PROMPT).subscribe(() => {
          this.store.dispatch(listCategoryActions.removeCompleted({ category }));
        });
        break;
      case categoryMenuAction.CATEGORY_ACTION_REMOVE.id:
        this.confirmPrompt(CATEGORY_REMOVE_PROMPT).subscribe(() => {
          this.store.dispatch(listCategoryActions.remove({ category }));
        });
        break;
    }
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch(action) {
      case itemMenuAction.ITEM_ACTION_UNDO.id:
        this.store.dispatch(listItemActions.undo({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_COMPLETE.id:
        this.store.dispatch(listItemActions.complete({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_EDIT.id:
        this.showEditItemModal(itemId);
        break;
      case itemMenuAction.ITEM_ACTION_INCREMENT.id:
        this.store.dispatch(listItemActions.increment({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_DECREMENT.id:
        this.decrementOrRemove(itemId);
        break;
      case itemMenuAction.ITEM_ACTION_REMOVE.id:
        this.confirmPrompt(ITEM_REMOVE_PROMPT).subscribe(() => {
          this.store.dispatch(listItemActions.remove({ itemId }));
        });
        break;
    }
  }

  onShowCreateItemModal(): void {

    const openCreateModal = () => {
      const title = 'Create item'; // TODO: Translate
      const modalInput: ItemFormModalInput = { title, item: null };
      const modal$ = this.modal.open(ItemFormModalComponent, modalInput);
      return modal$.closed();
    };

    const onError = () => {
      console.log('Item not created');
    };

    const onCreated = (output: ItemFormModalOutput) => {
      const { item, addToInventory } = output as CreateItemFormModalOutput;
      this.store.dispatch(listItemActions.create({ dto: item }));

      if (addToInventory) {
        const { amount, ...dto } = item;
        this.store.dispatch(inventoryItemActions.create({ dto }));
      }
    };

    openCreateModal()
      .subscribe({ next: onCreated, error: onError });
  }

  onItemToggle({ itemId, isDone }: ItemToggledOutput) {
    this.store.dispatch(listItemActions.toggle({ itemId }));
  }

  onPinCategory(category: string, isPinned: boolean) {
    if (isPinned) {
      this.store.dispatch(listFilterActions.setCategoryFilter({ category }));
    } else {
      this.store.dispatch(listFilterActions.clearCategoryFilter());
    }
  }

  onRemoveFilter(filter: ListFilterToken) {
    const name = filter.key;
    this.store.dispatch(listFilterActions.clearFilterByName({ name }));
  }

  trackByCategory(index: number, group: CategorizedListItems): string {
    return group.category;
  }

  private initPageMetadata(): void {
    this.layout.setTitle('List');
    this.store.dispatch(setCurrentTitle({ title: 'List - Pandivia' }));
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_LIST.id }));
  }

  private confirmPrompt(
    input: ConfirmPromptModalInput,
  ): Observable<ConfirmPromptModalOutput> {
    return this.modal.open(ConfirmPromptModalComponent, input).closed();
  }

  private showEditItemModal(itemId: string): void {

    const openEditModal = (item: ListItem) => {
      const title = 'Edit item'; // TODO: Translate
      const modalInput: ItemFormModalInput = { item, title };
      const modal$ = this.modal.open(ItemFormModalComponent, modalInput);
      return modal$.closed();
    };

    const onError = () => {
      console.log(`Item with id ${itemId} not edited`);
    };

    const onEdited = (output: ItemFormModalOutput) => {
      const item = output.item as ListItem;
      this.store.dispatch(listItemActions.edit({ item }));
      // TODO: Store effect
    };

    this.findItemById(itemId)
      .pipe(switchMap(openEditModal))
      .subscribe({ next: onEdited, error: onError });
  }

  private findItemById(itemId: string): Observable<ListItem> {

    const item$ = this.store.select(selectItemById(itemId)).pipe(take(1));

    return item$.pipe(switchMap(item => item
      ? of(item)
      : throwError(() => Error(`Item with id ${itemId} not found`))
    ));
  }

  private decrementOrRemove(itemId: string): void {
    const amount$ = this.store.select(selectItemAmount(itemId)).pipe(take(1));
    amount$.subscribe(amount => {
      if (amount <= 1) {
        this.confirmPrompt(ITEM_REMOVE_PROMPT).subscribe(() => {
          this.store.dispatch(listItemActions.remove({ itemId }));
        });
      } else {
        this.store.dispatch(listItemActions.decrement({ itemId }));
      }
    });
  }

  private initHeaderActions(): void {
    this.store.select(selectListIsDoneFilter).subscribe((isDoneFilter: boolean) => {
      const actions = listMenuAction.getListContextualMenu(isDoneFilter);
      this.layout.setHeaderActions(actions);
    });

    this.layout.headerActionEvent.subscribe(this.onListAction.bind(this));
  }
}
