import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { StackedLayoutService } from '@app/common/layouts';
import { NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';
import { ActionsMenuItem, CardListComponent, ItemActionOutput, ItemToggledOutput } from '@app/common/components';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { ITEM_CONTEXTUAL_MENU } from './item-contextual-menu';
import { LIST_CONTEXTUAL_MENU, LIST_REFRESH_ACTION } from './list-contextual-menu';
import { fetchListItemsActions, listFilterActions, selectListCategorizedFilteredItems } from './store';
import { ListItem } from '@app/core';

const IMPORTS = [
  NgIf,
  NgFor,
  AsyncPipe,
  JsonPipe,
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
  listContextualMenu = LIST_CONTEXTUAL_MENU;
  categoryContextualMenus = new Map<string, ActionsMenuItem[]>();
  itemContextualMenu = ITEM_CONTEXTUAL_MENU;

  ngOnInit() {
    this.initPageMetadata();
    this.layout.setHeaderActions(LIST_CONTEXTUAL_MENU);
    this.store.dispatch(fetchListItemsActions.fetchItems());
    this.layout.headerActionEvent.subscribe(this.onListContextualAction.bind(this));
  }

  onListContextualAction(action: string) {
    switch (action) {
      case LIST_REFRESH_ACTION.id:
        this.store.dispatch(fetchListItemsActions.forceFetchItems());
        break;
    }
  }

  onListAction(action: string) {
    console.log('onListAction', action);
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    console.log('onItemAction', itemId, action);
  }

  onItemToggle({ itemId, isDone }: ItemToggledOutput) {
    console.log('onItemToggle', itemId, isDone);
  }

  onPinCategory(category: string, isPinned: boolean) {
    if (isPinned) {
      this.store.dispatch(listFilterActions.setCategoryFilter({ category }));
    } else {
      this.store.dispatch(listFilterActions.clearCategoryFilter());  
    }
  }

  // TODO
  getItemActions(item: ListItem): ActionsMenuItem[] {
    return [];
  }

  private initPageMetadata(): void {
    this.layout.setTitle('List');
    this.store.dispatch(setCurrentTitle({ title: 'List - Pandivia' }));
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_LIST.id }));
  }
}
