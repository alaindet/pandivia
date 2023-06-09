import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, CardListComponent, ItemActionOutput, ItemToggledOutput, ModalService } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { CategorizedListItems, CreateListItemDto, ListItem } from '@app/core';
import { NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { Observable, combineLatest, delay, map, of, startWith, switchMap, take, throwError } from 'rxjs';
import * as itemMenuAction from './item.contextual-menu';
import * as listMenuAction from './list.contextual-menu';
import { listAllItemsActions, listCategoryActions, listFetchItemsActions, listFilterActions, listItemActions, selectItemAmount, selectItemById, selectListCategorizedFilteredItems, selectListCategoryFilter, selectListFilters, selectListIsLoaded } from './store';
import * as categoryMenuAction from './category.contextual-menu';
import { ListFilterToken } from './types';
import { ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput } from './components/confirm-prompt-modal';
import { CATEGORY_REMOVE_COMPLETED_PROMPT, CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_COMPLETED_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import { ItemFormModalComponent, ItemFormModalInput } from './components/item-form-modal';

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

  vm$ = combineLatest({
    itemGroups: this.store.select(selectListCategorizedFilteredItems),
    filters: this.store.select(selectListFilters),
    pinnedCategory: this.store.select(selectListCategoryFilter),
  }).pipe(startWith(null));

  ngOnInit() {
    this.initPageMetadata();
    this.layout.setHeaderActions(listMenuAction.LIST_CONTEXTUAL_MENU);
    this.store.dispatch(listFetchItemsActions.fetchItems());
    this.layout.headerActionEvent.subscribe(this.onListAction.bind(this));
  }

  onListAction(action: string) {
    switch (action) {
      case listMenuAction.LIST_ACTION_REFRESH.id:
        this.store.dispatch(listFetchItemsActions.forceFetchItems());
        break;
      case listMenuAction.LIST_ACTION_COMPLETE.id:
        this.store.dispatch(listAllItemsActions.complete());
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
        this.showEditModal(itemId);
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

  private showEditModal(itemId: string): void {
    this.store.select(selectItemById(itemId))
      .pipe(
        take(1),
        switchMap(item => !item
          ? throwError(() => Error(`Item with id ${itemId} not found`))
          : of(item)
        ),
        map(item => {
          const title = 'Edit item'; // TODO: Translate
          return { title, item } as ItemFormModalInput;
        }),
        switchMap(input => {
          return this.modal.open(ItemFormModalComponent, input).closed();
        }),
      )
      // TODO
      .subscribe({
        error: () => console.log(`Item with id ${itemId} not edited`),
        next: payload => {
          const item = payload.item as ListItem;
          if (item?.id) {
            this.store.dispatch(listItemActions.edit({ item }));
            // TODO: Store effect
          } else {
            const dto = payload.item as CreateListItemDto;
            this.store.dispatch(listItemActions.create({ dto }));
            // TODO: Store effect
          }
        },
      });
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
}