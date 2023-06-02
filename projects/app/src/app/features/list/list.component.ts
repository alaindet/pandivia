import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { ListItem } from '@app/core';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';
import { StackedLayoutService } from '@app/common/layouts';
import { ActionsMenuItem, CardListComponent, ItemActionOutput, ItemToggledOutput } from '@app/common/components';
import { LIST_CONTEXTUAL_MENU, LIST_ACTION_REFRESH } from './list-contextual-menu';
import { fetchListItemsActions, listItemActions, listFilterActions, selectListCategorizedFilteredItems, selectListFilters } from './store';
import * as itemMenuAction from './item-contextual-menu';

const IMPORTS = [
  NgIf,
  NgFor,
  AsyncPipe,
  CardListComponent,
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

  items$ = this.store.select(selectListCategorizedFilteredItems);
  filters$ = this.store.select(selectListFilters);
  listContextualMenu = LIST_CONTEXTUAL_MENU;
  categoryContextualMenus = new Map<string, ActionsMenuItem[]>();

  ngOnInit() {
    this.initPageMetadata();
    this.layout.setHeaderActions(LIST_CONTEXTUAL_MENU);
    this.store.dispatch(fetchListItemsActions.fetchItems());
    this.layout.headerActionEvent.subscribe(this.onListContextualAction.bind(this));
  }

  onListContextualAction(action: string) {
    switch (action) {
      case LIST_ACTION_REFRESH.id:
        this.store.dispatch(fetchListItemsActions.forceFetchItems());
        break;
    }
  }

  onListAction(action: string) {
    console.log('onListAction', action);
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch(action) {
      case itemMenuAction.ITEM_ACTION_UNDO.id:
        this.store.dispatch(listItemActions.undoItem({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_COMPLETE.id:
        this.store.dispatch(listItemActions.completeItem({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_EDIT.id:
        // TODO: Show edit modal
        break;
      case itemMenuAction.ITEM_ACTION_INCREMENT.id:
        this.store.dispatch(listItemActions.incrementItemAmount({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_DECREMENT.id:
        this.store.dispatch(listItemActions.decrementItemAmount({ itemId }));
        break;
      case itemMenuAction.ITEM_ACTION_DELETE.id:
        // TODO: Show delete modal prompt
        break;
    }
  }

  onItemToggle({ itemId, isDone }: ItemToggledOutput) {
    this.store.dispatch(listItemActions.toggleItem({ itemId }));
  }

  onPinCategory(category: string, isPinned: boolean) {
    if (isPinned) {
      this.store.dispatch(listFilterActions.setCategoryFilter({ category }));
    } else {
      this.store.dispatch(listFilterActions.clearCategoryFilter());  
    }
  }

  getItemActions(item: ListItem): ActionsMenuItem[] {
    return [
      item.isDone ? itemMenuAction.ITEM_ACTION_UNDO : itemMenuAction.ITEM_ACTION_COMPLETE,
      itemMenuAction.ITEM_ACTION_EDIT,
      itemMenuAction.ITEM_ACTION_INCREMENT,
      itemMenuAction.ITEM_ACTION_DECREMENT,
      itemMenuAction.ITEM_ACTION_DELETE,
    ];
  }

  private initPageMetadata(): void {
    this.layout.setTitle('List');
    this.store.dispatch(setCurrentTitle({ title: 'List - Pandivia' }));
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_LIST.id }));
  }
}
