import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItem, ActionsMenuItemDirective } from '../menu/actions-menu';
import { CheckboxComponent } from '../checkbox';
import { ButtonComponent } from '../button';

export type Item = { id: string } & Record<string, any>;

export type ItemActionsFn = (item: Item) => ActionsMenuItem[];
export type ItemActionOutput = { itemId: string, action: string };

const IMPORTS = [
  NgFor,
  MatIconModule,
  CheckboxComponent,
  ButtonComponent,
  ActionsMenuComponent,
  ActionsMenuItemDirective,
  ActionsMenuButtonDirective,
];

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './card-list.component.html',
})
export class CardListComponent {

  @Input() items!: any[];
  @Input() itemActionsFn!: ItemActionsFn;
  @Input() listActions!: ActionsMenuItem[];

  @Output() listActionClicked = new EventEmitter<string>();
  @Output() itemActionClicked = new EventEmitter<ItemActionOutput>();

  listTitle = 'TODO: Title';

  onListAction(action: string) {
    this.listActionClicked.emit(action);
  }

  onItemAction(itemId: string, action: string) {
    this.itemActionClicked.emit({ itemId, action });
  }
}
