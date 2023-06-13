import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Observable, combineLatest, of, startWith, switchMap, take, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';

import { CategorizedListItems, ListItem } from '@app/core';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';
import { ButtonComponent, CardListComponent, ItemActionOutput, ItemToggledOutput, ModalService, ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { ListItemFormModalComponent, ListItemFormModalInput } from './components/item-form-modal';
import { CATEGORY_REMOVE_COMPLETED_PROMPT, CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_COMPLETED_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import { listAllItemsActions, listCategoryActions, listFilterActions, listItemActions, listItemsAsyncReadActions, selectListCategorizedFilteredItems, selectListCategoryFilter, selectListFilters, selectListIsDoneFilter, selectListItemAmount, selectListItemById } from './store';
import { ListFilterToken } from './types';
import * as listMenu from './contextual-menus/list';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';

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

  CATEGORY_CONTEXTUAL_MENU = categoryMenu.CATEGORY_CONTEXTUAL_MENU;
  getItemContextualMenu = itemMenu.getItemContextualMenu;

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
      case listMenu.LIST_ACTION_REFRESH.id:
        this.store.dispatch(listItemsAsyncReadActions.forceFetchItems());
        break;
      case listMenu.LIST_ACTION_COMPLETE.id:
        this.store.dispatch(listAllItemsActions.complete());
        break;
      case listMenu.LIST_ACTION_HIDE_COMPLETED.id:
        this.store.dispatch(listFilterActions.setDoneFilter({ isDone: true }));
        break;
      case listMenu.LIST_ACTION_SHOW_COMPLETED.id:
        this.store.dispatch(listFilterActions.clearDoneFilter());
        break;
      case listMenu.LIST_ACTION_UNDO.id:
        this.store.dispatch(listAllItemsActions.undo());
        break;
      case listMenu.LIST_ACTION_REMOVE_COMPLETED.id:
        this.confirmPrompt(LIST_REMOVE_COMPLETED_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listAllItemsActions.removeCompleted()),
        });
        break;
      case listMenu.LIST_ACTION_REMOVE.id:
        this.confirmPrompt(LIST_REMOVE_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listAllItemsActions.remove()),
        });
        break;
    }
  }

  onCategoryAction(category: string, action: string) {
    switch (action) {
      case categoryMenu.CATEGORY_ACTION_COMPLETE.id:
        this.store.dispatch(listCategoryActions.complete({ category }));
        break;
      case categoryMenu.CATEGORY_ACTION_UNDO.id:
        this.store.dispatch(listCategoryActions.undo({ category }));
        break;
      case categoryMenu.CATEGORY_ACTION_REMOVE_COMPLETED.id:
        this.confirmPrompt(CATEGORY_REMOVE_COMPLETED_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listCategoryActions.removeCompleted({ category })),
        });
        break;
      case categoryMenu.CATEGORY_ACTION_REMOVE.id:
        this.confirmPrompt(CATEGORY_REMOVE_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listCategoryActions.remove({ category })),
          });
        break;
    }
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch(action) {
      case itemMenu.ITEM_ACTION_UNDO.id:
        this.store.dispatch(listItemActions.undo({ itemId }));
        break;
      case itemMenu.ITEM_ACTION_COMPLETE.id:
        this.store.dispatch(listItemActions.complete({ itemId }));
        break;
      case itemMenu.ITEM_ACTION_EDIT.id:
        this.showEditItemModal(itemId);
        break;
      case itemMenu.ITEM_ACTION_INCREMENT.id:
        this.store.dispatch(listItemActions.increment({ itemId }));
        break;
      case itemMenu.ITEM_ACTION_DECREMENT.id:
        this.decrementOrRemove(itemId);
        break;
      case itemMenu.ITEM_ACTION_REMOVE.id:
        this.confirmPrompt(ITEM_REMOVE_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listItemActions.remove({ itemId })),
        });
        break;
    }
  }

  onShowCreateItemModal(): void {
    const title = 'Create item'; // TODO: Translate
    const modalInput: ListItemFormModalInput = { title, item: null };
    this.modal.open(ListItemFormModalComponent, modalInput);
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
    this.layout.setTitle('List'); // TODO: Translate
    this.store.dispatch(setCurrentTitle({ title: 'List - Pandivia' })); // TODO: Translate
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_LIST.id }));
  }

  private confirmPrompt(
    input: ConfirmPromptModalInput,
  ): Observable<ConfirmPromptModalOutput> {
    return this.modal.open(ConfirmPromptModalComponent, input).closed();
  }

  private showEditItemModal(itemId: string): void {
    this.findItemById(itemId).subscribe(item => {
      const title = 'Edit item'; // TODO: Translate
      const modalInput: ListItemFormModalInput = { item, title };
      this.modal.open(ListItemFormModalComponent, modalInput);
    });
  }

  private findItemById(itemId: string): Observable<ListItem> {

    const item$ = this.store.select(selectListItemById(itemId)).pipe(take(1));

    return item$.pipe(switchMap(item => item
      ? of(item)
      : throwError(() => Error(`Item with id ${itemId} not found`))
    ));
  }

  private decrementOrRemove(itemId: string): void {
    const amount$ = this.store.select(selectListItemAmount(itemId)).pipe(take(1));
    amount$.subscribe(amount => {
      if (amount <= 1) {
        this.confirmPrompt(ITEM_REMOVE_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listItemActions.remove({ itemId })),
        });
      } else {
        this.store.dispatch(listItemActions.decrement({ itemId }));
      }
    });
  }

  private initHeaderActions(): void {
    this.store.select(selectListIsDoneFilter).subscribe((isDoneFilter: boolean) => {
      const actions = listMenu.getListContextualMenu(isDoneFilter);
      this.layout.setHeaderActions(actions);
    });

    this.layout.headerActionEvent.subscribe(this.onListAction.bind(this));
  }
}
