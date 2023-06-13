import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { ACTIONS_MENU_EXPORTS, ButtonComponent, CardListComponent, ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput, ItemActionOutput, ModalService, PageHeaderComponent } from '@app/common/components';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { NAVIGATION_ITEM_INVENTORY } from '@app/core/constants/navigation';
import { StackedLayoutService } from '@app/common/layouts';
import * as listMenu from './contextual-menus/list';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';
import { Observable, combineLatest, map, of, switchMap, take, throwError, withLatestFrom } from 'rxjs';
import { inventoryAllItemsActions, inventoryCategoryActions, inventoryFilterActions, inventoryItemActions, inventoryItemsAsyncReadActions, selectInventoryCategorizedFilteredItems, selectInventoryCategoryFilter, selectInventoryFilters, selectInventoryItemById } from './store';
import { CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import { InventoryItemFormModalComponent, InventoryItemFormModalInput } from './components/item-form-modal';
import { InventoryFilterToken } from './types';
import { CategorizedInventoryItems, CreateListItemDto, InventoryItem, ListItem, notificationsActions } from '@app/core';
import { listItemActions, selectListItemExistsWithName } from '../list/store';
import { findInventoryItemById } from './functions';

const IMPORTS = [
  CommonModule,
  PageHeaderComponent,
  ...ACTIONS_MENU_EXPORTS,
  MatIconModule,
  ButtonComponent,
  CardListComponent,
];

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryPageComponent implements OnInit {

  private store = inject(Store);
  private layout = inject(StackedLayoutService);
  private modal = inject(ModalService);

  CATEGORY_CONTEXTUAL_MENU = categoryMenu.CATEGORY_CONTEXTUAL_MENU;
  getItemContextualMenu = itemMenu.getItemContextualMenu;

  itemGroups = this.store.selectSignal(selectInventoryCategorizedFilteredItems);
  filters = this.store.selectSignal(selectInventoryFilters);
  pinnedCategory = this.store.selectSignal(selectInventoryCategoryFilter);

  ngOnInit() {
    this.initPageMetadata();
    this.initHeaderActions();
    this.store.dispatch(inventoryItemsAsyncReadActions.fetchItems());
  }

  onListAction(action: string) {
    switch (action) {
      case listMenu.LIST_ACTION_REFRESH.id:
        this.store.dispatch(inventoryItemsAsyncReadActions.forceFetchItems());
        break;
      case listMenu.LIST_ACTION_REMOVE.id:
        this.confirmPrompt(LIST_REMOVE_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(inventoryAllItemsActions.remove()),
        });
        break;
    }
  }

  onCategoryAction(category: string, action: string) {
    switch (action) {
      case categoryMenu.CATEGORY_ACTION_CREATE_ITEM.id:
        this.showCreateItemByCategoryModal(category);
        break;
      case categoryMenu.CATEGORY_ACTION_REMOVE.id:
        this.confirmPrompt(CATEGORY_REMOVE_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(inventoryCategoryActions.remove({ category })),
        });
        break;
    }
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch(action) {
      case itemMenu.ITEM_ACTION_ADD_TO_LIST.id:
        this.cloneItemToList(itemId);
        break;
      case itemMenu.ITEM_ACTION_EDIT.id:
        this.showEditItemModal(itemId);
        break;
      case itemMenu.ITEM_ACTION_REMOVE.id:
        this.confirmPrompt(ITEM_REMOVE_PROMPT).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(inventoryItemActions.remove({ itemId })),
        });
        break;
    }
  }

  onShowCreateItemModal(): void {
    const title = 'Create item'; // TODO: Translate
    const modalInput: InventoryItemFormModalInput = { title };
    this.modal.open(InventoryItemFormModalComponent, modalInput);
  }

  onPinCategory(category: string, isPinned: boolean) {
    if (isPinned) {
      this.store.dispatch(inventoryFilterActions.setCategoryFilter({ category }));
    } else {
      this.store.dispatch(inventoryFilterActions.clearCategoryFilter());
    }
  }

  onRemoveFilter(filter: InventoryFilterToken) {
    const name = filter.key;
    this.store.dispatch(inventoryFilterActions.clearFilterByName({ name }));
  }

  trackByCategory(index: number, group: CategorizedInventoryItems): string {
    return group.category;
  }

  private initPageMetadata(): void {
    this.layout.setTitle('Inventory'); // TODO: Translate
    this.store.dispatch(setCurrentTitle({ title: 'Inventory - Pandivia' })); // TODO: Translate
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_INVENTORY.id }));
  }

  private initHeaderActions(): void {
    this.layout.setHeaderActions(listMenu.LIST_CONTEXTUAL_MENU);
    this.layout.headerActionEvent.subscribe(this.onListAction.bind(this));
  }

  private confirmPrompt(
    input: ConfirmPromptModalInput,
  ): Observable<ConfirmPromptModalOutput> {
    return this.modal.open(ConfirmPromptModalComponent, input).closed();
  }

  private showEditItemModal(itemId: string): void {
    findInventoryItemById(this.store, itemId).subscribe({
      error: err => {
        const message = err;
        this.store.dispatch(notificationsActions.addError({ message }));
      },
      next: item => {
        const title = 'Edit item'; // TODO: Translate
        const modalInput: InventoryItemFormModalInput = { title, item };
        this.modal.open(InventoryItemFormModalComponent, modalInput);
      },
    });
  }

  private showCreateItemByCategoryModal(category: string): void {
    const title = 'Create item'; // TODO: Translate
    const modalInput: InventoryItemFormModalInput = { title, category };
    this.modal.open(InventoryItemFormModalComponent, modalInput);
  }

  private cloneItemToList(itemId: string): void {

    const inventoryItem = findInventoryItemById(this.store, itemId);

    const listItem = inventoryItem.pipe(
      switchMap(({ name }) => this.store.select(selectListItemExistsWithName(name))),
      take(1),
    );

    const checkUniqueNameContraint = (payload: {
      inventoryItem: InventoryItem;
      listItem: ListItem | null;
    }) => {
      const { inventoryItem, listItem } = payload;
      const inventoryItemName = inventoryItem?.name?.toLowerCase();
      const listItemName = listItem?.name?.toLowerCase();
      return (inventoryItemName === listItemName)
        // TODO: Translate
        ? throwError(() => new Error(`List item with name "${listItem?.name}" already exists`))
        : of(inventoryItem);
    };

    combineLatest({ inventoryItem, listItem })
      .pipe(take(1), switchMap(checkUniqueNameContraint))
      .subscribe({
        error: message => this.store.dispatch(notificationsActions.addError({ message })),
        next: inventoryItem => {
    
          const dto: CreateListItemDto = {
            category: inventoryItem?.category ?? '',
            name: inventoryItem.name,
            amount: 1,
          };
    
          if (inventoryItem.description) {
            dto.description = inventoryItem.description;
          }
    
          this.store.dispatch(listItemActions.create({ dto }));
        },
      });
  }
}
