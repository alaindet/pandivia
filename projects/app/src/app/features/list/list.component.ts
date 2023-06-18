import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, map, switchMap, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { environment } from '@app/environment';
import { NotificationService, getThemeCheckboxColor, selectUiTheme } from '@app/core';
import { uiNavigationActions, uiSetPageTitle } from '@app/core/store';
import { NAVIGATION_ITEM_LIST } from '@app/core/navigation';
import { ButtonComponent, CardListComponent, ItemActionOutput, ItemToggledOutput, ModalService, ConfirmPromptModalComponent, ConfirmPromptModalInput, ConfirmPromptModalOutput, CheckboxColor, ActionsMenuItem } from '@app/common/components';
import { readErrorI18n } from '@app/common/utils';
import { StackedLayoutService } from '@app/common/layouts';
import { ListItemFormModalComponent, ListItemFormModalInput } from './components/item-form-modal';
import { CATEGORY_REMOVE_COMPLETED_PROMPT, CATEGORY_REMOVE_PROMPT, ITEM_REMOVE_PROMPT, LIST_REMOVE_COMPLETED_PROMPT, LIST_REMOVE_PROMPT } from './constants';
import { listAllItemsActions, listCategoryActions, listFilterActions, listItemActions, listItemsAsyncReadActions, selectListCategorizedFilteredItems, selectListCategoryFilter, selectListFilters, selectListInErrorStatus, selectListIsDoneFilter, selectListIsLoaded, selectListItemAmount } from './store';
import { ListFilterToken, CategorizedListItems, ListItem } from './types';
import * as listMenu from './contextual-menus/list';
import * as categoryMenu from './contextual-menus/category';
import * as itemMenu from './contextual-menus/item';
import { findListItemById } from './functions';
import { OnceSource } from '@app/common/sources';

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
  private notification = inject(NotificationService);
  private modal = inject(ModalService);
  private transloco = inject(TranslocoService);

  getItemContextualMenu = (item: ListItem) => {
    return itemMenu.getItemContextualMenu(item).map(action => {
      const label = this.transloco.translate(action.label);
      return { ...action, label };
    });
  };

  categoryContextualMenu!: ActionsMenuItem[];
  itemGroups = this.store.selectSignal(selectListCategorizedFilteredItems);
  loaded = this.store.selectSignal(selectListIsLoaded);
  inErrorStatus = this.store.selectSignal(selectListInErrorStatus);
  filters = this.store.selectSignal(selectListFilters);
  pinnedCategory = this.store.selectSignal(selectListCategoryFilter);
  uiTheme = this.store.selectSignal(selectUiTheme);
  uiCheckboxColor = computed<CheckboxColor>(() => getThemeCheckboxColor(this.uiTheme()));

  ngOnInit() {
    this.initPageMetadata();
    this.initListContextualMenu();
    this.initCategoryContextualMenu();
    this.store.dispatch(listItemsAsyncReadActions.fetchItems());
  }

  ngOnDestroy() {
    this.once.trigger();
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
      case listMenu.LIST_ACTION_REMOVE_COMPLETED.id: {

        // TODO: Refactor in a function?
        const config = LIST_REMOVE_COMPLETED_PROMPT;
        const title = this.transloco.translate(config.title);
        const message = this.transloco.translate(config.message);
        const prompt = { ...config, title, message };

        this.confirmPrompt(prompt).subscribe({
          error: () => console.log('Canceled'),
          next: () => this.store.dispatch(listAllItemsActions.removeCompleted()),
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
          next: () => this.store.dispatch(listAllItemsActions.remove()),
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
        this.store.dispatch(listCategoryActions.complete({ category }));
        break;
      case categoryMenu.CATEGORY_ACTION_UNDO.id:
        this.store.dispatch(listCategoryActions.undo({ category }));
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
          next: () => this.store.dispatch(listCategoryActions.removeCompleted({ category })),
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
          next: () => this.store.dispatch(listCategoryActions.remove({ category })),
          });
        break;
      }
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
            next: () => this.store.dispatch(listItemActions.remove({ itemId })),
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
    const headerTitle = this.transloco.translate('list.title');
    this.layout.setTitle(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.store.dispatch(uiSetPageTitle({ title }));
    const current = NAVIGATION_ITEM_LIST.id;
    this.store.dispatch(uiNavigationActions.setCurrent({ current }));
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
      error: err => this.notification.error(...readErrorI18n(err)),
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
          next: () => this.store.dispatch(listItemActions.remove({ itemId })),
        });
      } else {
        this.store.dispatch(listItemActions.decrement({ itemId }));
      }
    });
  }

  private initListContextualMenu(): void {
    this.store.select(selectListIsDoneFilter).subscribe((isDoneFilter: boolean) => {
      const actions = listMenu.getListContextualMenu(isDoneFilter).map(action => {
        const label = this.transloco.translate(action.label);
        return { ...action, label };
      });
      this.layout.setHeaderActions(actions);
    });

    this.layout.headerActionEvent
      .pipe(takeUntil(this.once.event$))
      .subscribe(this.onListAction.bind(this));
  }

  private initCategoryContextualMenu(): void {
    this.categoryContextualMenu = categoryMenu.CATEGORY_CONTEXTUAL_MENU.map(item => {
      const label = this.transloco.translate(item.label);
      return { ...item, label };
    })
  }
}
