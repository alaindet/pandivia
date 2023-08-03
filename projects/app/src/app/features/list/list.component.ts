import { Component, OnDestroy, OnInit, Signal, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Observable, catchError, map, of, switchMap, take, takeUntil, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { environment } from '@app/environment';
import { DEFAULT_CATEGORY, UiService } from '@app/core';
import { uiSetCurrentNavigation, uiSetPageTitle } from '@app/core/store';
import { NAVIGATION_ITEM_LIST } from '@app/core/ui';
import { ButtonComponent, CardListComponent, ItemActionOutput, ItemToggledOutput, ModalService, ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput, ActionsMenuItem, ChangeCategoryModalComponent, ChangeCategoryModalInput } from '@app/common/components';
import { readErrorI18n } from '@app/common/utils';
import { StackedLayoutService } from '@app/common/layouts';
import { OnceSource } from '@app/common/sources';
import { ListItemFormModalComponent, ListItemFormModalInput } from './components/item-form-modal';
import { CATEGORY_REMOVE_COMPLETED_PROMPT, CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_COMPLETED_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import { listCompleteItem, listCompleteItems, listCompleteItemsByCategory, listDecrementItem, listEditItem, listFetchItems, listFilters, listIncrementItem, listRemoveCompletedItems, listRemoveCompletedItemsByCategory, listRemoveItem, listRemoveItems, listRemoveItemsByCategory, listToggleItem, listUndoItem, listUndoItems, listUndoItemsByCategory, selectListCategories, selectListCategorizedFilteredItems, selectListCategoryFilter, selectListCounters, selectListFilters, selectListInErrorStatus, selectListIsDoneFilter, selectListIsLoaded } from './store';
import { ListFilterToken, CategorizedListItems, ListItem, LIST_FILTER } from './types';
import * as listMenu from './contextual-menus/list';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';
import { findListItemById } from './functions';

const imports = [
  NgIf,
  NgFor,
  NgTemplateOutlet,
  AsyncPipe,
  CardListComponent,
  ButtonComponent,
  MatIconModule,
  TranslocoModule,
];

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListPageComponent implements OnInit, OnDestroy {

  private once = new OnceSource();
  private store = inject(Store);
  private layout = inject(StackedLayoutService);
  private ui = inject(UiService);
  private modal = inject(ModalService);
  private transloco = inject(TranslocoService);

  DEFAULT_CATEGORY = DEFAULT_CATEGORY;
  categoryContextualMenu!: ActionsMenuItem[];
  itemGroups = this.store.selectSignal(selectListCategorizedFilteredItems);
  loaded = this.store.selectSignal(selectListIsLoaded);
  inErrorStatus = this.store.selectSignal(selectListInErrorStatus);
  themeConfig = this.ui.theme.config;
  pinnedCategory = this.store.selectSignal(selectListCategoryFilter);
  filters = this.getTranslatedFilters();
  getItemContextualMenu = this.getTranslatedItemContextualMenuFn();
  counters = this.store.selectSignal(selectListCounters);
  pageCounters$ = effect(
    () => this.layout.headerCounters.set(this.counters()),
    { allowSignalWrites: true },
  );

  ngOnInit() {
    this.initPageMetadata();
    this.initListContextualMenu();
    this.initCategoryContextualMenu();
    this.initSearchFeature();
    this.store.dispatch(listFetchItems.try());
  }

  ngOnDestroy() {
    this.once.trigger();
  }

  onListAction(action: string) {
    switch (action) {
      case listMenu.LIST_ACTION_REFRESH.id:
        this.store.dispatch(listFetchItems.force());
        break;
      case listMenu.LIST_ACTION_COMPLETE.id:
        this.store.dispatch(listCompleteItems.try());
        break;
      case listMenu.LIST_ACTION_HIDE_COMPLETED.id:
        this.store.dispatch(listFilters.setCompleted({ isDone: true }));
        break;
      case listMenu.LIST_ACTION_SHOW_COMPLETED.id:
        this.store.dispatch(listFilters.clearCompleted());
        break;
      case listMenu.LIST_ACTION_UNDO.id:
        this.store.dispatch(listUndoItems.try());
        break;
      case listMenu.LIST_ACTION_REMOVE_COMPLETED.id: {

        // TODO: Refactor in a function?
        const config = LIST_REMOVE_COMPLETED_PROMPT;
        const title = this.transloco.translate(config.title);
        const message = this.transloco.translate(config.message);
        const prompt = { ...config, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listRemoveCompletedItems.try()),
        });
        break;
      }
      case listMenu.LIST_ACTION_REMOVE.id: {

        // TODO: Refactor in a function?
        const config = LIST_REMOVE_PROMPT;
        const title = this.transloco.translate(config.title);
        const message = this.transloco.translate(config.message);
        const prompt = { ...config, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listRemoveItems.try()),
        });
        break;
      }
    }
  }

  onCategoryAction(category: string, action: string) {
    switch (action) {
      case categoryMenu.CATEGORY_ACTION_CREATE_ITEM.id:
        this.showCreateItemByCategoryModal(category);
        break;
      case categoryMenu.CATEGORY_ACTION_COMPLETE.id:
        this.store.dispatch(listCompleteItemsByCategory.try({ category }));
        break;
      case categoryMenu.CATEGORY_ACTION_UNDO.id:
        this.store.dispatch(listUndoItemsByCategory.try({ category }));
        break;
      case categoryMenu.CATEGORY_ACTION_REMOVE_COMPLETED.id: {

        // TODO: Refactor in a function?
        const config = CATEGORY_REMOVE_COMPLETED_PROMPT;
        const params = { categoryName: category };
        const title = this.transloco.translate(config.title);
        const message = this.transloco.translate(config.message, params);
        const prompt = { ...config, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(
            listRemoveCompletedItemsByCategory.try({ category })
          ),
        });
        break;
      }
      case categoryMenu.CATEGORY_ACTION_REMOVE.id: {

        // TODO: Refactor in a function?
        const config = CATEGORY_REMOVE_PROMPT;
        const params = { categoryName: category };
        const title = this.transloco.translate(config.title);
        const message = this.transloco.translate(config.message, params);
        const prompt = { ...config, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listRemoveItemsByCategory.try({ category })),
          });
        break;
      }
    }
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch(action) {
      case itemMenu.ITEM_ACTION_COMPLETE.id:
        this.store.dispatch(listCompleteItem.try({ itemId }));
        break;
      case itemMenu.ITEM_ACTION_UNDO.id:
        this.store.dispatch(listUndoItem.try({ itemId }));
        break;
      case itemMenu.ITEM_ACTION_EDIT.id:
        this.showEditItemModal(itemId);
        break;
      case itemMenu.ITEM_ACTION_MOVE_TO_CATEGORY.id:
        this.showMoveToCategoryModal(itemId);
        break;
      case itemMenu.ITEM_ACTION_INCREMENT.id:
        this.store.dispatch(listIncrementItem.try({ itemId }));
        break;
      case itemMenu.ITEM_ACTION_DECREMENT.id:
        this.decrementOrRemove(itemId);
        break;
      case itemMenu.ITEM_ACTION_REMOVE.id: {
        findListItemById(this.store, itemId)
          .pipe(switchMap(item => {
            // TODO: Refactor in a function?
            const config = ITEM_REMOVE_PROMPT;
            const params = { itemName: item.name };
            const title = this.transloco.translate(config.title);
            const message = this.transloco.translate(config.message, params);
            const prompt = { ...config, title, message };

            return this.confirmPrompt(prompt);
          })).subscribe({
            error: () => console.log('Canceled'),
            next: () => this.store.dispatch(listRemoveItem.try({ itemId })),
          });
        break;
      }
    }
  }

  onShowCreateItemModal(): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
    const modalInput: ListItemFormModalInput = { title };
    this.modal.open(ListItemFormModalComponent, modalInput);
  }

  onItemToggle({ itemId, isDone }: ItemToggledOutput) {
    this.store.dispatch(listToggleItem.try({ itemId }));
  }

  onPinCategory(category: string, isPinned: boolean) {
    if (isPinned) {
      this.store.dispatch(listFilters.setCategory({ category }));
    } else {
      this.store.dispatch(listFilters.clearCategory());
    }
  }

  onRemoveFilter(filter: ListFilterToken) {
    const name = filter.key;
    this.store.dispatch(listFilters.clearByName({ name }));

    if (name === LIST_FILTER.SEARCH_QUERY) {
      this.layout.search.clear(false);
      this.layout.search.hide();
    }
  }

  trackByCategory(index: number, group: CategorizedListItems): string {
    return group.category;
  }

  private getTranslatedFilters(): Signal<ListFilterToken[] | null> {
    return toSignal(this.store.select(selectListFilters).pipe(map(filters => {
      if (filters === null) return null;
      return filters.map(filter => {
        if (filter.label !== DEFAULT_CATEGORY) return filter;
        return { ...filter, label: 'common.uncategorized' };
      });
    }))) as Signal<ListFilterToken[] | null>;
  }

  private getTranslatedItemContextualMenuFn(): (item: ListItem) => ActionsMenuItem[] {
    return (item: ListItem) => {
      return itemMenu.getItemContextualMenu(item).map(action => {
        const label = this.transloco.translate(action.label);
        return { ...action, label };
      });
    };
  }

  private initPageMetadata(): void {
    const headerTitle = this.transloco.translate('list.title');
    this.layout.title.set(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.store.dispatch(uiSetPageTitle({ title }));
    const current = NAVIGATION_ITEM_LIST.id;
    this.store.dispatch(uiSetCurrentNavigation({ current }));
  }

  private confirmPrompt(
    input: ConfirmPromptModalInput,
  ): Observable<ConfirmPromptModalOutput> {
    const modal$ = this.modal.open(ConfirmPromptModalComponent, input);
    return modal$.closed().pipe(take(1));
  }

  private showCreateItemByCategoryModal(category: string): void {
    const title = this.transloco.translate('common.itemModal.createTitle');
    const modalInput: ListItemFormModalInput = { title, category };
    this.modal.open(ListItemFormModalComponent, modalInput);
  }

  private showEditItemModal(itemId: string): void {
    findListItemById(this.store, itemId).subscribe({
      error: err => this.ui.notification.err(...readErrorI18n(err)),
      next: item => {
        const title = this.transloco.translate('common.itemModal.editTitle');
        const modalInput: ListItemFormModalInput = { item, title };
        this.modal.open(ListItemFormModalComponent, modalInput);
      },
    });
  }

  private decrementOrRemove(itemId: string): void {
    findListItemById(this.store, itemId).subscribe(item => {
      if (item.amount <= 1) {

        // TODO: Refactor in a function?
        const config = ITEM_REMOVE_PROMPT;
        const params = { itemName: item.name };
        const title = this.transloco.translate(config.title);
        const message = this.transloco.translate(config.message, params);
        const prompt = { ...config, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listRemoveItem.try({ itemId })),
        });
      } else {
        this.store.dispatch(listDecrementItem.try({ itemId }));
      }
    });
  }

  private initListContextualMenu(): void {
    this.store.select(selectListIsDoneFilter).subscribe(isDoneFilter => {
      const actions = listMenu.getListContextualMenu(isDoneFilter).map(action => {
        const label = this.transloco.translate(action.label);
        return { ...action, label };
      });
      this.layout.headerActions.set(actions);
    });

    this.layout.headerActions.confirmed$
      .pipe(takeUntil(this.once.event$))
      .subscribe(this.onListAction.bind(this));
  }

  private initCategoryContextualMenu(): void {
    this.categoryContextualMenu = categoryMenu.CATEGORY_CONTEXTUAL_MENU.map(item => {
      const label = this.transloco.translate(item.label);
      return { ...item, label };
    })
  }

  private initSearchFeature(): void {
    // For some reason, it triggers a NG0100 error
    // https://angular.io/errors/NG0100
    queueMicrotask(() => this.layout.search.enable());
    // this.layout.search.enable();

    this.layout.search.searched$.subscribe(searchQuery => {
      !!searchQuery
        ? this.store.dispatch(listFilters.setSearchQuery({ searchQuery }))
        : this.store.dispatch(listFilters.clearSearchQuery());
    });

    this.layout.search.cleared$.subscribe(() => {
      this.store.dispatch(listFilters.clearSearchQuery());
    });
  }

  private showMoveToCategoryModal(itemId: string): void {

    let theItem!: ListItem;
    const translatedUncategorized = this.transloco.translate('common.uncategorized');

    const translateCategory = (category: string): string => {
      if (category !== DEFAULT_CATEGORY) return category;
      return translatedUncategorized;
    };

    findListItemById(this.store, itemId).pipe(
      switchMap(item => {
        theItem = item;
        const title = this.transloco.translate('common.menu.moveToCategory');
        const allCategories = this.store.selectSignal(selectListCategories);
        const categories = allCategories()
          .filter(category => category !== item.category)
          .map(category => translateCategory(category));

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
        let { category } = modalPayload;
        if (category === translatedUncategorized) category = DEFAULT_CATEGORY;
        const item = { ...theItem, category };
        // TODO: Please add a specific "Move to category" action
        this.store.dispatch(listEditItem.try({ item }));
      },
    });
  }
}
