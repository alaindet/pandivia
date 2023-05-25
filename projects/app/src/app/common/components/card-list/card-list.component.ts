import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItem } from '../menu/actions-menu';
import { CheckboxComponent } from '../checkbox';
import { ButtonComponent } from '../button';
import { ItemActionOutput, ItemActionsFn } from './types';

const IMPORTS = [
  NgFor,
  MatIconModule,
  CheckboxComponent,
  ButtonComponent,
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
];

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-card-list' },
})
export class CardListComponent {

  @Input({ required: true }) title!: string;
  @Input({ required: true }) items!: any[];
  @Input({ required: true }) itemActionsFn!: ItemActionsFn;
  @Input({ required: true }) listActions!: ActionsMenuItem[];
  @Input() isPinned = false;

  @Output() listActionClicked = new EventEmitter<string>();
  @Output() itemActionClicked = new EventEmitter<ItemActionOutput>();
  @Output() pinned = new EventEmitter<boolean>();

  onListAction(action: string) {
    this.listActionClicked.emit(action);
  }

  onItemAction(itemId: string, action: string) {
    this.itemActionClicked.emit({ itemId, action });
  }

  onTogglePin() {
    this.isPinned = !this.isPinned;
    this.pinned.emit(this.isPinned);
  }
}
