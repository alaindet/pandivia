import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, catchError, combineLatest, map, merge, mergeAll, of, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { environment } from '@app/environment';
import { ACTIONS_MENU_EXPORTS, ActionsMenuItem, ButtonComponent, CardListComponent, ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput, ItemActionOutput, ModalService, PageHeaderComponent } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { errorI18n, readErrorI18n } from '@app/common/utils';
import { NAVIGATION_ITEM_INVENTORY } from '@app/core/ui';
import { uiSetCurrentNavigation, uiSetPageTitle } from '@app/core/store';
import { CreateListItemDto, ListItem } from '@app/features/list';
import { listCreateItem, selectListItemExistsWithName } from '../list/store';
import { InventoryItemFormModalComponent, InventoryItemFormModalInput } from './components/item-form-modal';
import { CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';
import * as listMenu from './contextual-menus/list';
import { findInventoryItemById } from './functions';
import { inventoryEditItem, inventoryFetchItems, inventoryFilters, inventoryRemoveItem, inventoryRemoveItems, inventoryRemoveItemsByCategory, selectInventoryCategories, selectInventoryCategorizedFilteredItems, selectInventoryCategoryFilter, selectInventoryCounters, selectInventoryFilters, selectInventoryInErrorStatus, selectInventoryIsLoaded } from './store';
import { CategorizedInventoryItems, InventoryFilterToken, InventoryItem } from './types';
import { OnceSource } from '@app/common/sources';
import { UiService } from '@app/core/ui';
import { toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_CATEGORY } from '@app/core';
import { ChangeCategoryModalComponent, ChangeCategoryModalInput, ChangeCategoryModalOutput } from '../../common/components/change-category-modal';

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
export class InventoryPageComponent implements OnInit, OnDestroy {

  private once = new OnceSource();
  private store = inject(Store);
  private layout = inject(StackedLayoutService);
  private ui = inject(UiService);
  private modal = inject(ModalService);
  private transloco = inject(TranslocoService);

  DEFAULT_CATEGORY = DEFAULT_CATEGORY;
  categoryContextualMenu!: ActionsMenuItem[];
  itemGroups = this.store.selectSignal(selectInventoryCategorizedFilteredItems);
  loaded = this.store.selectSignal(selectInventoryIsLoaded);
  inErrorStatus = this.store.selectSignal(selectInventoryInErrorStatus);
  themeConfig = this.ui.theme.config;
  getItemContextualMenu = this.getTranslatedItemContextualMenuFn();
  filters = this.getTranslatedFilters();
  pinnedCategory = this.store.selectSignal(selectInventoryCategoryFilter);
  counters = this.store.selectSignal(selectInventoryCounters);
  pageCounters$ = effect(
    () => this.layout.headerCounters.set(this.counters()),
    { allowSignalWrites: true },
  );

  ngOnInit() {
    this.initPageMetadata();
    this.initListContextualMenu();
    this.initCategoryContextualMenu();
    this.initSearchFeature();
    this.store.dispatch(inventoryFetchItems.try());
  }

  ngOnDestroy() {
    this.once.trigger();
  }

  onListAction(action: string) {
    switch (action) {
      case listMenu.LIST_ACTION_REFRESH.id: {
        this.store.dispatch(inventoryFetchItems.force());
        break;
      }
      case listMenu.LIST_ACTION_REMOVE.id: {
        const title = this.transloco.translate(LIST_REMOVE_PROMPT.title);
        const message = this.transloco.translate(LIST_REMOVE_PROMPT.message);
        const prompt = { ...LIST_REMOVE_PROMPT, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(inventoryRemoveItems.try()),
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
          next: () => {
            const action = inventoryRemoveItemsByCategory.try({ category });
            this.store.dispatch(action);
          },
        });
        break;
      }
    }
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch(action) {
      case itemMenu.ITEM_ACTION_ADD_TO_LIST.id:
        this.cloneItemToList(itemId);
        break;
      case itemMenu.ITEM_ACTION_MOVE_TO_CATEGORY.id:
        this.showMoveToCategoryModal(itemId);
        break;
      case itemMenu.ITEM_ACTION_EDIT.id:
        this.showEditItemModal(itemId);
        break;
      case itemMenu.ITEM_ACTION_REMOVE.id:
        findInventoryItemById(this.store, itemId)
          .pipe(switchMap(item => {
            const config = ITEM_REMOVE_PROMPT;
            const params = { itemName: item.name };
            const title = this.transloco.translate(config.title, params);
            const message = this.transloco.translate(config.message, params);
            const prompt = { ...ITEM_REMOVE_PROMPT, title, message };
            return this.confirmPrompt(prompt);
          }))
          .subscribe(() => {
            this.store.dispatch(inventoryRemoveItem.try({ itemId }));
          });
        break;
    }
  }

  onShowCreateItemModal(): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
    const modalInput: InventoryItemFormModalInput = { title };
    this.modal.open(InventoryItemFormModalComponent, modalInput);
  }

  onPinCategory(category: string, isPinned: boolean) {
    if (isPinned) {
      this.store.dispatch(inventoryFilters.setCategory({ category }));
    } else {
      this.store.dispatch(inventoryFilters.clearCategory());
    }
  }

  onRemoveFilter(filter: InventoryFilterToken) {
    const name = filter.key;
    this.store.dispatch(inventoryFilters.clearByName({ name }));
  }

  trackByCategory(index: number, group: CategorizedInventoryItems): string {
    return group.category;
  }

  private getTranslatedItemContextualMenuFn(): (item: InventoryItem) => ActionsMenuItem[] {
    return (item: InventoryItem) => {
      return itemMenu.getItemContextualMenu(item).map(action => {
        const label = this.transloco.translate(action.label);
        return { ...action, label };
      });
    };
  }

  private getTranslatedFilters(): Signal<InventoryFilterToken[] | null> {
    return toSignal(this.store.select(selectInventoryFilters).pipe(map(filters => {
      if (filters === null) return null;
      return filters.map(filter => {
        if (filter.label !== DEFAULT_CATEGORY) return filter;
        return { ...filter, label: 'common.uncategorized' };
      });
    }))) as Signal<InventoryFilterToken[] | null>;
  }

  private initPageMetadata(): void {
    const headerTitle = this.transloco.translate('inventory.title');
    this.layout.title.set(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.store.dispatch(uiSetPageTitle({ title }));
    const current = NAVIGATION_ITEM_INVENTORY.id;
    this.store.dispatch(uiSetCurrentNavigation({ current }));
  }

  private initListContextualMenu(): void {
    const actions = listMenu.LIST_CONTEXTUAL_MENU.map(action => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
    this.layout.headerActions.set(actions);
    this.layout.headerActions.confirmed$
      .pipe(takeUntil(this.once.event$))
      .subscribe(this.onListAction.bind(this));
  }

  private initCategoryContextualMenu(): void {
    const actions = categoryMenu.CATEGORY_CONTEXTUAL_MENU.map(action => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
    this.categoryContextualMenu = actions;
  }

  private initSearchFeature(): void {
    // For some reason, it triggers a NG0100 error
    // https://angular.io/errors/NG0100
    queueMicrotask(() => this.layout.search.enable());
    // this.layout.search.enable();

    this.layout.search.searched$.subscribe(searchQuery => {
      !!searchQuery
        ? this.store.dispatch(inventoryFilters.setSearchQuery({ searchQuery }))
        : this.store.dispatch(inventoryFilters.clearSearchQuery());
    });

    this.layout.search.cleared$.subscribe(() => {
      this.store.dispatch(inventoryFilters.clearSearchQuery());
    });
  }

  private confirmPrompt(
    input: ConfirmPromptModalInput,
  ): Observable<ConfirmPromptModalOutput> {
    const modal$ = this.modal.open(ConfirmPromptModalComponent, input);
    return modal$.closed().pipe(take(1));
  }

  private showEditItemModal(itemId: string): void {
    findInventoryItemById(this.store, itemId).subscribe({
      error: err => this.ui.notification.err(...readErrorI18n(err)),
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
        error: err => this.ui.notification.err(...readErrorI18n(err)),
        next: inventoryItem => {

          const dto: CreateListItemDto = {
            category: inventoryItem?.category ?? '',
            name: inventoryItem.name,
            amount: 1,
          };

          if (inventoryItem.description) {
            dto.description = inventoryItem.description;
          }

          this.store.dispatch(listCreateItem.try({ dto }));
        },
      });
  }

  private showMoveToCategoryModal(itemId: string): void {

    let theItem!: InventoryItem;

    findInventoryItemById(this.store, itemId).pipe(
      switchMap(item => {
        theItem = item;
        const title = this.transloco.translate('common.menu.moveToCategory');
        const allCategories = this.store.selectSignal(selectInventoryCategories);
        const categories = allCategories().filter(cat => cat !== item.category);

        if (!categories.length) {
          return throwError(() => Error(JSON.stringify({
            message: 'common.error.onlyOneCategory',
          })));
        }

        const modalInput: ChangeCategoryModalInput = { title, categories };
        const modal$ = this.modal.open(ChangeCategoryModalComponent, modalInput);

        return modal$.closed().pipe(
          // Emit canceled modal as a silent error
          catchError(() => of(null)),
          take(1),
        );
      }),
    ).subscribe({
      error: err => this.ui.notification.err(...readErrorI18n(err)),
      next: modalPayload => {
        if (modalPayload === null) return; // Modal was canceled
        const { category } = modalPayload;
        const item = { ...theItem, category };
        // TODO: Please add a specific "Move to category" action
        this.store.dispatch(inventoryEditItem.try({ item }));
      },
    });
  }
}
