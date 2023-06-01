import { Component } from '@angular/core';

import { ActionsMenuItem, CardListComponent, ItemActionsFn, ItemActionOutput, ItemToggledOutput } from '@app/common/components';
import { ListItem } from '@app/core';

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

  items: ListItem[] = [
    {
      id: 'aaa',
      name: 'Pizza',
      amount: 1,
      isDone: false,
      description: 'A pizza, any pizza is fine',
      category: 'shop-foo',
    },
    {
      id: 'bbb',
      name: 'Pineapple',
      amount: 1,
      isDone: false,
      description: 'A pineapple, any pineapple is fine. But not on pizza.',
      category: 'shop-foo',
    },
    {
      id: 'ccc',
      name: 'Pepperoni',
      amount: 1,
      isDone: false,
      description: 'Pepperoni, just some pepperoni, whatever that is',
      category: 'shop-foo',
    },
  ];

  listActions: ActionsMenuItem[] = [
    { id: 'category:tick', icon: 'done', label: 'Tick all' },
    { id: 'category:delete', icon: 'delete', label: 'Delete all' },
  ];

  itemActionsFn: ItemActionsFn = (item: any) => {

    if (item.isDone) {
      return [
        { id: 'item:undo', icon: 'undo', label: 'Undo' },
        { id: 'item:delete', icon: 'delete', label: 'Delete' },
      ];
    }

    return [
      { id: 'item:tick', icon: 'done', label: 'Tick' },
      { id: 'item:delete', icon: 'delete', label: 'Delete' },
    ];
  };

  onListAction(action: string) {
    switch(action) {
      case 'category:tick':
        this.items = this.items.map(item => ({ ...item, isDone: true }));
        break;
      case 'category:delete':
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
      case 'item:tick':
        this.items = this.items.map(item => {
          return item.id !== itemId ? item : { ...item, isDone: true };
        });
        break;
      case 'item:undo':
        this.items = this.items.map(item => {
          return item.id !== itemId ? item : { ...item, isDone: false };
        });
        break;
      case 'item:delete':
        this.items = this.items.filter(item => {
          return item.id !== itemId;
        });
        break;
    }
  }
}
