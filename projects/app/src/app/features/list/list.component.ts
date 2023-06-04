import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, CardListComponent, ItemActionOutput, ItemToggledOutput } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { CategorizedListItems } from '@app/core';
import { NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { combineLatest } from 'rxjs';
import * as itemMenuAction from './item.contextual-menu';
import * as listMenuAction from './list.contextual-menu';
import { listAllItemsActions, listCategoryActions, listFetchItemsActions, listFilterActions, listItemActions, selectListCategorizedFilteredItems, selectListCategoryFilter, selectListFilters } from './store';
import * as categoryMenuAction from './category.contextual-menu';
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

  CATEGORY_CONTEXTUAL_MENU = categoryMenuAction.CATEGORY_CONTEXTUAL_MENU;
  getItemContextualMenu = itemMenuAction.getItemContextualMenu;

  vm$ = combineLatest({
    itemGroups: this.store.select(selectListCategorizedFilteredItems),
    filters: this.store.select(selectListFilters),
    pinnedCategory: this.store.select(selectListCategoryFilter),
  });

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
        // TODO: Ask first
        // this.store.dispatch(listAllItemsActions.removeCompleted());
        break;
      case listMenuAction.LIST_ACTION_REMOVE.id:
        // TODO: Ask first
        // this.store.dispatch(listAllItemsActions.remove());
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
        // TODO: Ask first
        // this.store.dispatch(listCategoryActions.removeCompleted({ category }));
        break;
      case categoryMenuAction.CATEGORY_ACTION_REMOVE.id:
        // TODO: Ask first
        // this.store.dispatch(listCategoryActions.remove({ category }));
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
        // TODO: Show edit modal
        break;
      case itemMenuAction.ITEM_ACTION_INCREMENT.id:
        this.store.dispatch(listItemActions.increment({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_DECREMENT.id:
        this.store.dispatch(listItemActions.decrement({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_REMOVE.id:
        // TODO: Ask first
        // this.store.dispatch(listItemActions.remove({ itemId }));
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
}
