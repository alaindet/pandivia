import { Component } from '@angular/core';

import { CardListComponent, ItemActionOutput, ItemToggledOutput } from '@app/common/components';
import { MOCK_INVENTORY_ITEMS, MOCK_LIST_ITEMS } from '@app/mocks';
import { ITEM_ACTION_DELETE, ITEM_ACTION_TICK, ITEM_ACTION_UNDO, LIST_ACTIONS, LIST_ACTION_DELETE, LIST_ACTION_TICK, getItemContextualMenu } from './actions';

const IMPORTS = [
  CardListComponent,
];

@Component({
  selector: 'app-demo-card-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './card-list.component.html',
})
export class CardListDemoPageComponent {

  consoleLog = console.log;

  items = MOCK_LIST_ITEMS;
  listActions = LIST_ACTIONS;
  itemActionsFn = getItemContextualMenu;

  nonSelectableItems = MOCK_INVENTORY_ITEMS;

  onListAction(action: string) {
    switch(action) {
      case LIST_ACTION_TICK.id:
        this.items = this.items.map(item => ({ ...item, isDone: true }));
        break;
      case LIST_ACTION_DELETE.id:
        this.items = [];
        break;
    }
  }

  onItemToggle({ itemId, isDone }: ItemToggledOutput) {
    this.items = this.items.map(item => {
      return item.id !== itemId ? item : { ...item, isDone };
    });
  }

  onItemAction({ itemId, action }: ItemActionOutput) {
    switch (action) {
      case ITEM_ACTION_TICK.id:
        this.items = this.items.map(item => {
          return item.id !== itemId ? item : { ...item, isDone: true };
        });
        break;
      case ITEM_ACTION_UNDO.id:
        this.items = this.items.map(item => {
          return item.id !== itemId ? item : { ...item, isDone: false };
        });
        break;
      case ITEM_ACTION_DELETE.id:
        this.items = this.items.filter(item => {
          return item.id !== itemId;
        });
        break;
    }
  }
}
