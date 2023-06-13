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
import { Observable, of, switchMap, take, throwError } from 'rxjs';
import { inventoryAllItemsActions, inventoryCategoryActions, inventoryFilterActions, inventoryItemActions, inventoryItemsAsyncReadActions, selectInventoryCategorizedFilteredItems, selectInventoryCategoryFilter, selectInventoryFilters, selectInventoryItemById } from './store';
import { CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import { InventoryItemFormModalComponent, InventoryItemFormModalInput } from './components/item-form-modal';
import { InventoryFilterToken } from './types';
import { CategorizedInventoryItems, InventoryItem } from '@app/core';

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
      case itemMenu.ITEM_ACTION_EDIT.id:
        // TODO
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
    const modalInput: InventoryItemFormModalInput = { title, item: null };
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
    this.findItemById(itemId).subscribe(item => {
      const title = 'Edit item'; // TODO: Translate
      const modalInput: InventoryItemFormModalInput = { item, title };
      this.modal.open(InventoryItemFormModalComponent, modalInput);
    });
  }

  private findItemById(itemId: string): Observable<InventoryItem> {

    const item$ = this.store.select(selectInventoryItemById(itemId)).pipe(take(1));

    return item$.pipe(switchMap(item => item
      ? of(item)
      : throwError(() => Error(`Item with id ${itemId} not found`))
    ));
  }
}
