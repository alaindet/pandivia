import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItem } from '../menu/actions-menu';
import { CheckboxComponent } from '../checkbox';
import { ButtonComponent } from '../button';
import { ItemActionOutput, ItemToggledOutput, ItemActionsFn } from './types';
import { didInputChange } from '@app/common/utils';

const IMPORTS = [
  NgIf,
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
export class CardListComponent implements OnChanges {

  @Input({ required: true }) title!: string;
  @Input({ required: true }) listActions!: ActionsMenuItem[];
  @Input({ required: true }) items!: any[];
  @Input({ required: true }) itemActionsFn!: ItemActionsFn;
  @Input() isPinned = false;

  @Output() listActionClicked = new EventEmitter<string>();
  @Output() itemActionClicked = new EventEmitter<ItemActionOutput>();
  @Output() itemToggled = new EventEmitter<ItemToggledOutput>();
  @Output() pinned = new EventEmitter<boolean>();

  itemActionsMap = new Map<string, ActionsMenuItem[]>();
  itemsDescriptionMap = new Map<string, boolean>();

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['items'])) {
      const itemActionsMap = new Map<string, ActionsMenuItem[]>();
      this.items.forEach(item => {
        itemActionsMap.set(item.id, this.itemActionsFn(item));
      });
      this.itemActionsMap = itemActionsMap;
    }
  }

  onListAction(action: string) {
    this.listActionClicked.emit(action);
  }

  onTogglePin() {
    this.isPinned = !this.isPinned;
    this.pinned.emit(this.isPinned);
  }

  onToggleItem(itemId: string, isDone: boolean | null = null) {
    if (isDone !== null) {
      this.itemToggled.emit({ itemId, isDone });
    } else {
      const isDone = !this.items.find(it => it.id === itemId).isDone;
      this.itemToggled.emit({ itemId, isDone });
    }
  }

  onItemAction(itemId: string, action: string) {
    this.itemActionClicked.emit({ itemId, action });
  }

  onToggleDescription(itemId: string) {
    const existing = this.itemsDescriptionMap.get(itemId) ?? false;
    this.itemsDescriptionMap.set(itemId, !existing);
  }
}
