import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItemDirective, ButtonComponent, PageHeaderComponent, ShoppingListComponent, ShoppingListItemComponent } from '@app/common/components';
import { ITEM_CONTEXTUAL_MENU, LIST_CONTEXTUAL_MENU, LIST_REFRESH_ACTION } from './contextual-menu';
import { fetchItemsActions, selectGroupedListItems } from './store';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { NAVIGATION_ITEM_INVENTORY, NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';

const IMPORTS = [
  CommonModule,
  PageHeaderComponent,
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItemDirective,
  MatIconModule,
  ButtonComponent,
  ShoppingListComponent,
  ShoppingListItemComponent,
];

@Component({
  selector: 'app-inventory-feature',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryFeatureComponent implements OnInit {

  private store = inject(Store);

  items$ = this.store.select(selectGroupedListItems);
  listContextualMenu = LIST_CONTEXTUAL_MENU;
  itemContextualMenu = ITEM_CONTEXTUAL_MENU;

  ngOnInit() {
    this.store.dispatch(setCurrentTitle({ title: 'Inventory - Pandivia' }));
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_INVENTORY.id }));
    this.store.dispatch(fetchItemsActions.fetchItems());
  }

  onListContextualAction(action: string) {
    switch (action) {
      case LIST_REFRESH_ACTION.id:
        this.store.dispatch(fetchItemsActions.forceFetchItems());
        break;
    }
  }

  onItemClick(itemId: string) {
    console.log('onItemClick', itemId);
  }
}
