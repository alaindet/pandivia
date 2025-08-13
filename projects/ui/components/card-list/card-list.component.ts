import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  linkedSignal,
  output
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  matCheck,
  matClear,
  matClose,
  matExpandLess,
  matExpandMore,
  matMoreHoriz,
  matPushPin,
} from '@ng-icons/material-icons/baseline';

import {
  ActionsMenuButtonDirective,
  ActionsMenuComponent,
  ActionsMenuItem,
} from '../actions-menu';
import { ButtonComponent } from '../button';
import { CheckboxColor, CheckboxComponent } from '../checkbox';
import { IconButtonComponent } from '../icon-button';
import {
  CardListCounters,
  CardListItem,
  CardListItemActionOutput,
  CardListItemActionsFn,
  CardListItemToggledOutput,
} from './types';

@Component({
  selector: 'app-card-list',
  imports: [
    NgIcon,
    CheckboxComponent,
    ButtonComponent,
    IconButtonComponent,
    ActionsMenuComponent,
    ActionsMenuButtonDirective,
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
  host: {
    class: 'app-card-list',
    '[class.-muted-title]': 'withMutedTitle()',
    '[class.-selectable]': 'isSelectable()',
    '[class.-completed]': 'isCompleted()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent {
  title = input.required<string>();
  listActions = input.required<ActionsMenuItem[]>();
  items = input.required<CardListItem[]>();
  itemActionsFn = input.required<CardListItemActionsFn>();
  withMutedTitle = input(false, { transform: booleanAttribute });
  isSelectable = input(true, { transform: booleanAttribute });
  _isPinned = input(false, { alias: 'isPinned', transform: booleanAttribute });
  withCounters = input(true, { transform: booleanAttribute });
  checkboxColor = input<CheckboxColor>('black');
  i18nPin = input('Pin');
  i18nUnpin = input('Unpin');

  listActionClicked = output<string>();
  itemActionClicked = output<CardListItemActionOutput>();
  itemToggled = output<CardListItemToggledOutput>();
  pinned = output<boolean>();
  icon = {
    matCheck,
    matClear,
    matClose,
    matExpandLess,
    matExpandMore,
    matMoreHoriz,
    matPushPin,
  };

  itemsDescriptionMap = new Map<string, boolean>();
  isCompleted = computed(() => this.computeIsCompleted());
  isPinned = linkedSignal(() => this._isPinned());
  counters = computed(() => this.computeCounters());
  itemActionsMap = computed(() => this.computeItemActionsMap());

  onListAction(action: string) {
    this.listActionClicked.emit(action);
  }

  onTogglePin() {
    const isPinned = this.isPinned();
    this.isPinned.set(!isPinned);
    this.pinned.emit(!isPinned);
  }

  onToggleItem(itemId: string) {
    if (!this.isSelectable()) {
      return;
    }
    const items = this.items();
    const isDone = !items.find((it) => it.id === itemId)?.isDone;
    this.itemToggled.emit({ itemId, isDone });
  }

  onItemAction(itemId: string, action: string) {
    this.itemActionClicked.emit({ itemId, action });
  }

  onToggleDescription(itemId: string) {
    const existing = this.itemsDescriptionMap.get(itemId) ?? false;
    this.itemsDescriptionMap.set(itemId, !existing);
  }

  private computeIsCompleted(): boolean {
    if (!this.withCounters()) {
      return false;
    }

    const counters = this.counters();
    if (counters === null) {
      return false;
    }

    return counters.done === counters.total;
  }

  private computeItemActionsMap(): Map<string, ActionsMenuItem[]> {
    const itemActionsMap = new Map<string, ActionsMenuItem[]>();
    const fn = this.itemActionsFn();

    for (const item of this.items()) {
      itemActionsMap.set(item.id, fn(item));
    }

    return itemActionsMap;
  }

  private computeCounters(): CardListCounters | null {
    if (!this.withCounters()) {
      return null;
    }

    let done = 0;
    const items = this.items();

    for (const item of items) {
      if (item.isDone) {
        done++;
      }
    }

    const total = items.length;
    return { done, total };
  }
}
