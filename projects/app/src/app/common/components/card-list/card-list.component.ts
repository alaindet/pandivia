import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation, WritableSignal, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

import { ListItem } from '@app/features/list';
import { InventoryItem } from '@app/features/inventory';
import { didInputChange } from '@app/common/utils';
import { ACTIONS_MENU_EXPORTS, ActionsMenuItem } from '../menu/actions-menu';
import { CheckboxColor, CheckboxComponent } from '../checkbox';
import { ButtonComponent } from '../button';
import { ItemActionOutput, ItemToggledOutput, ItemActionsFn, CardListComponentLabels, CardListCounters } from './types';
import { DEFAULT_CATEGORY } from '@app/core/constants';

const imports = [
  NgIf,
  NgFor,
  NgTemplateOutlet,
  MatIconModule,
  CheckboxComponent,
  ButtonComponent,
  ...ACTIONS_MENU_EXPORTS,
];

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports,
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-card-list' },
})
export class CardListComponent implements OnChanges {

  @Input({ required: true }) title!: string;
  @Input({ required: true }) listActions!: ActionsMenuItem[];
  @Input({ required: true }) items!: ListItem[] | InventoryItem[]; // TODO: Generalize type!
  @Input({ required: true }) itemActionsFn!: ItemActionsFn;
  @Input() labels?: CardListComponentLabels;
  @Input() @HostBinding('class.-muted-title') withMutedTitle = false;
  @Input() @HostBinding('class.-selectable') isSelectable = true;
  @Input() checkboxColor: CheckboxColor = 'black';
  @Input() isPinned = false;
  @Input() withCounters = false;

  @Output() listActionClicked = new EventEmitter<string>();
  @Output() itemActionClicked = new EventEmitter<ItemActionOutput>();
  @Output() itemToggled = new EventEmitter<ItemToggledOutput>();
  @Output() pinned = new EventEmitter<boolean>();

  DEFAULT_CATEGORY = DEFAULT_CATEGORY;
  itemActionsMap = new Map<string, ActionsMenuItem[]>();
  itemsDescriptionMap = new Map<string, boolean>();
  counters: WritableSignal<CardListCounters> | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['items'])) {
      this.itemActionsMap = this.updateActionsByItemMap(this.items);
      if (this.withCounters) {
        this.updateCounters(this.items as ListItem[]);
      }
    }
  }

  onListAction(action: string) {
    this.listActionClicked.emit(action);
  }

  onTogglePin() {
    this.isPinned = !this.isPinned;
    this.pinned.emit(this.isPinned);
  }

  onToggleItem(itemId: string) {
    if (!this.isSelectable) return;
    const isDone = !(this.items as ListItem[]).find(it => it.id === itemId)?.isDone;
    this.itemToggled.emit({ itemId, isDone });
  }

  onItemAction(itemId: string, action: string) {
    this.itemActionClicked.emit({ itemId, action });
  }

  onToggleDescription(itemId: string) {
    const existing = this.itemsDescriptionMap.get(itemId) ?? false;
    this.itemsDescriptionMap.set(itemId, !existing);
  }

  trackByItemId(index: number, item: ListItem | InventoryItem): string {
    return item.id;
  }

  private updateActionsByItemMap(
    items: ListItem[] | InventoryItem[],
  ): Map<string, ActionsMenuItem[]> {
    const itemActionsMap = new Map<string, ActionsMenuItem[]>();
    this.items.forEach(item => {
      itemActionsMap.set(item.id, this.itemActionsFn(item));
    });
    return itemActionsMap;
  }

  private updateCounters(items: ListItem[]) {
    let done = 0;
    items.forEach(item => {
      if (item.isDone) {
        done++;
      }
    });
    const total = items.length;
    this.counters = signal<CardListCounters>({ done, total });
  }
}
