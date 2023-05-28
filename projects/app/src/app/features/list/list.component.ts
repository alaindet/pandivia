import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';
import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItemDirective, ButtonComponent, PageHeaderComponent } from '@app/common/components';
import { LIST_CONTEXTUAL_MENU, LIST_REFRESH_ACTION, LIST_SELECT_ITEMS_ACTION } from './list-contextual-menu';
import { ITEM_CONTEXTUAL_MENU } from './item-contextual-menu';
import { fetchListItemsActions, selectListCategorizedItems } from './store';
import { StackedLayoutService } from '@app/common/layouts';

const IMPORTS = [
  CommonModule,
  PageHeaderComponent,
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItemDirective,
  MatIconModule,
  ButtonComponent,
  // ShoppingListComponent,
  // ShoppingListItemComponent,
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

  items$ = this.store.select(selectListCategorizedItems);
  listContextualMenu = LIST_CONTEXTUAL_MENU;
  itemContextualMenu = ITEM_CONTEXTUAL_MENU;

  selectableList = signal(false);

  ngOnInit() {
    this.store.dispatch(setCurrentTitle({ title: 'List - Pandivia' }));
    this.layout.title.set('List');
    this.layout.headerActions.set(LIST_CONTEXTUAL_MENU);
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_LIST.id }));
    this.store.dispatch(fetchListItemsActions.fetchItems());
  }

  onListContextualAction(action: string) {
    switch (action) {
      case LIST_REFRESH_ACTION.id:
        this.store.dispatch(fetchListItemsActions.forceFetchItems());
        break;
      case LIST_SELECT_ITEMS_ACTION.id:
        // TODO: Use store?
        this.selectableList.set(true);
        break;
    }
  }

  onItemClick(itemId: string) {
    console.log('onItemClick', itemId);
  }
}
