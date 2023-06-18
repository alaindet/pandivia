import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of, switchMap, take, throwError } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { environment } from '@app/environment';
import { ACTIONS_MENU_EXPORTS, ActionsMenuItem, ButtonComponent, CardListComponent, ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput, ItemActionOutput, ModalService, PageHeaderComponent } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { errorI18n, readErrorI18n } from '@app/common/utils';
import { NotificationService } from '@app/core';
import { NAVIGATION_ITEM_INVENTORY } from '@app/core/navigation';
import { uiNavigationActions, uiSetPageTitle } from '@app/core/store';
import { CreateListItemDto, ListItem } from '@app/features/list';
import { listItemActions, selectListItemExistsWithName } from '../list/store';
import { InventoryItemFormModalComponent, InventoryItemFormModalInput } from './components/item-form-modal';
import { CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';
import * as listMenu from './contextual-menus/list';
import { findInventoryItemById } from './functions';
import { inventoryAllItemsActions, inventoryCategoryActions, inventoryFilterActions, inventoryItemActions, inventoryItemsAsyncReadActions, selectInventoryCategorizedFilteredItems, selectInventoryCategoryFilter, selectInventoryFilters, selectInventoryInErrorStatus, selectInventoryIsLoaded } from './store';
import { CategorizedInventoryItems, InventoryFilterToken, InventoryItem } from './types';

const imports = [
  CommonModule,
  PageHeaderComponent,
  ...ACTIONS_MENU_EXPORTS,
  MatIconModule,
  ButtonComponent,
  CardListComponent,
  TranslocoModule,
];

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryPageComponent implements OnInit {

  private store = inject(Store);
  private layout = inject(StackedLayoutService);
  private notification = inject(NotificationService);
  private modal = inject(ModalService);
  private transloco = inject(TranslocoService);

  getItemContextualMenu = (item: InventoryItem) => {
    return itemMenu.getItemContextualMenu(item).map(action => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
  };

  categoryContextualMenu!: ActionsMenuItem[];
  itemGroups = this.store.selectSignal(selectInventoryCategorizedFilteredItems);
  loaded = this.store.selectSignal(selectInventoryIsLoaded);
  inErrorStatus = this.store.selectSignal(selectInventoryInErrorStatus);
  filters = this.store.selectSignal(selectInventoryFilters);
  pinnedCategory = this.store.selectSignal(selectInventoryCategoryFilter);

  ngOnInit() {
    this.initPageMetadata();
    this.initListContextualMenu();
    this.initCategoryContextualMenu();
    this.store.dispatch(inventoryItemsAsyncReadActions.fetchItems());
  }

  onListAction(action: string) {
    switch (action) {
      case listMenu.LIST_ACTION_REFRESH.id: {
        this.store.dispatch(inventoryItemsAsyncReadActions.forceFetchItems());
        break;
      }
      case listMenu.LIST_ACTION_REMOVE.id: {
        const title = this.transloco.translate(LIST_REMOVE_PROMPT.title);
        const message = this.transloco.translate(LIST_REMOVE_PROMPT.message);
        const prompt = { ...LIST_REMOVE_PROMPT, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(inventoryAllItemsActions.remove()),
        });
        break;
      }
    }
  }

  onCategoryAction(category: string, action: string) {
    switch (action) {
      case categoryMenu.CATEGORY_ACTION_CREATE_ITEM.id: {
        this.showCreateItemByCategoryModal(category);
        break;
      }
      case categoryMenu.CATEGORY_ACTION_REMOVE.id: {
        const config = CATEGORY_REMOVE_PROMPT;
        const params = { categoryName: category };
        const title = this.transloco.translate(config.title, params);
        const message = this.transloco.translate(config.message, params);
        const prompt = { ...CATEGORY_REMOVE_PROMPT, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(inventoryCategoryActions.remove({ category })),
        });
        break;
      }
    }
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch(action) {
      case itemMenu.ITEM_ACTION_ADD_TO_LIST.id: {
        this.cloneItemToList(itemId);
        break;
      }
      case itemMenu.ITEM_ACTION_EDIT.id: {
        this.showEditItemModal(itemId);
        break;
      }
      case itemMenu.ITEM_ACTION_REMOVE.id: {
        findInventoryItemById(this.store, itemId)
          .pipe(switchMap(item => {
            const config = ITEM_REMOVE_PROMPT;
            const params = { itemName: item.name };
            const title = this.transloco.translate(config.title, params);
            const message = this.transloco.translate(config.message, params);
            const prompt = { ...ITEM_REMOVE_PROMPT, title, message };
            return this.confirmPrompt(prompt);
          }))
          .subscribe({
            error: () => console.log('Canceled'),
            next: () => this.store.dispatch(inventoryItemActions.remove({ itemId })),
          });
        break;
      }
    }
  }

  onShowCreateItemModal(): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
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
    const headerTitle = this.transloco.translate('inventory.title');
    this.layout.setTitle(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.store.dispatch(uiSetPageTitle({ title }));
    const current = NAVIGATION_ITEM_INVENTORY.id;
    this.store.dispatch(uiNavigationActions.setCurrent({ current }));
  }

  private initListContextualMenu(): void {
    const actions = listMenu.LIST_CONTEXTUAL_MENU.map(action => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
    this.layout.setHeaderActions(actions);
    this.layout.headerActionEvent.subscribe(this.onListAction.bind(this));
  }

  private initCategoryContextualMenu(): void {
    const actions = categoryMenu.CATEGORY_CONTEXTUAL_MENU.map(action => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
    this.categoryContextualMenu = actions;
  }

  private confirmPrompt(
    input: ConfirmPromptModalInput,
  ): Observable<ConfirmPromptModalOutput> {
    return this.modal.open(ConfirmPromptModalComponent, input).closed();
  }

  private showEditItemModal(itemId: string): void {
    findInventoryItemById(this.store, itemId).subscribe({
      error: err => this.notification.error(...readErrorI18n(err)),
      next: item => {
        const title = this.transloco.translate('common.itemModal.editTitle');
        const modalInput: InventoryItemFormModalInput = { title, item };
        this.modal.open(InventoryItemFormModalComponent, modalInput);
      },
    });
  }

  private showCreateItemByCategoryModal(category: string): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
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
      const name = inventoryItemName;
      return (inventoryItemName === listItemName)
        ? throwError(() => errorI18n('list.error.itemUnique', { name }))
        : of(inventoryItem);
    };

    combineLatest({ inventoryItem, listItem })
      .pipe(take(1), switchMap(checkUniqueNameContraint))
      .subscribe({
        error: err => this.notification.error(...readErrorI18n(err)),
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
