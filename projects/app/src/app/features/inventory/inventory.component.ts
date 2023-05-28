import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItemDirective, ButtonComponent, PageHeaderComponent } from '@app/common/components';
import { ITEM_CONTEXTUAL_MENU, LIST_CONTEXTUAL_MENU, LIST_REFRESH_ACTION } from './contextual-menu';
import { fetchInventoryItemsActions, selectInventoryCategorizedItems } from './store';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { NAVIGATION_ITEM_INVENTORY } from '@app/core/constants/navigation';
import { StackedLayoutService } from '@app/common/layouts';

const IMPORTS = [
  CommonModule,
  PageHeaderComponent,
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItemDirective,
  MatIconModule,
  ButtonComponent,
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

  items$ = this.store.select(selectInventoryCategorizedItems);
  listContextualMenu = LIST_CONTEXTUAL_MENU;
  itemContextualMenu = ITEM_CONTEXTUAL_MENU;

  ngOnInit() {
    this.layout.title.set('Inventory');
    this.store.dispatch(setCurrentTitle({ title: 'Inventory - Pandivia' }));
    this.layout.headerActions.set(LIST_CONTEXTUAL_MENU);
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_INVENTORY.id }));
    this.store.dispatch(fetchInventoryItemsActions.fetchItems());
  }

  onListContextualAction(action: string) {
    switch (action) {
      case LIST_REFRESH_ACTION.id:
        this.store.dispatch(fetchInventoryItemsActions.forceFetchItems());
        break;
    }
  }

  onItemClick(itemId: string) {
    console.log('onItemClick', itemId);
  }
}
