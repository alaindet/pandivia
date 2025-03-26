import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
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

import { DEFAULT_CATEGORY } from '@app/core/constants';
import { InventoryItem } from '@app/features/inventory';
import { ListItem } from '@app/features/list';
import { ButtonComponent } from '../button';
import { CheckboxColor, CheckboxComponent } from '../checkbox';
import { ACTIONS_MENU_EXPORTS, ActionsMenuItem } from '../menu/actions-menu';
import {
  CardListComponentLabels,
  CardListCounters,
  ItemActionOutput,
  ItemActionsFn,
  ItemToggledOutput,
} from './types';

@Component({
  selector: 'app-card-list',
  imports: [
    NgIcon,
    CheckboxComponent,
    ButtonComponent,
    ...ACTIONS_MENU_EXPORTS,
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
  host: { class: 'app-card-list' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent {
  title = input.required<string>();
  listActions = input.required<ActionsMenuItem[]>();
  items = input.required<any[]>();
  itemActionsFn = input.required<ItemActionsFn>();
  labels = input<CardListComponentLabels>();
  withMutedTitle = input(false);
  isSelectable = input(true);
  _isPinned = input(true, { alias: 'isPinned' });
  withCounters = input(true);
  checkboxColor = input<CheckboxColor>('black');

  listActionClicked = output<string>();
  itemActionClicked = output<ItemActionOutput>();
  itemToggled = output<ItemToggledOutput>();
  pinned = output<boolean>();
  pinnedLabel = computed(() => this.labels()?.pinned);
  unpinnedLabel = computed(() => this.labels()?.unpinned);

  matCheck = matCheck;
  matClear = matClear;
  matClose = matClose;
  matExpandLess = matExpandLess;
  matExpandMore = matExpandMore;
  matMoreHoriz = matMoreHoriz;
  matPushPin = matPushPin;

  @HostBinding('class.-muted-title')
  get cssClassMutedTitle() {
    return this.withMutedTitle();
  }

  @HostBinding('class.-selectable')
  get cssClassSelectable() {
    return this.isSelectable();
  }

  @HostBinding('class.-completed')
  get cssClassCompleted() {
    return this.isCompleted();
  }

  DEFAULT_CATEGORY = DEFAULT_CATEGORY;
  itemActionsMap = new Map<string, ActionsMenuItem[]>();
  itemsDescriptionMap = new Map<string, boolean>();
  counters = signal<CardListCounters | null>(null);
  isCompleted = computed(() => this.computeIsCompleted());
  isPinned = signal(true);

  itemsEffect = effect(() => {
    const items = this.items();
    this.itemActionsMap = this.updateActionsByItemMap(items);
    if (this.withCounters()) {
      this.updateCounters(items as ListItem[]);
    }
  });

  isPinnedEffect = effect(() => {
    this.isPinned.set(this._isPinned());
  });

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
    const items = this.items() as ListItem[];
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

  private updateActionsByItemMap(
    items: ListItem[] | InventoryItem[]
  ): Map<string, ActionsMenuItem[]> {
    const itemActionsMap = new Map<string, ActionsMenuItem[]>();
    const fn = this.itemActionsFn();
    items.forEach((item) => itemActionsMap.set(item.id, fn(item)));
    return itemActionsMap;
  }

  private updateCounters(items: ListItem[]) {
    let done = 0;
    items.forEach((item) => {
      if (item.isDone) {
        done++;
      }
    });
    const total = items.length;
    this.counters.set({ done, total });
  }
}
