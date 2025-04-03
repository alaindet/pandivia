import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
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

import { CheckboxComponent, CheckboxColor } from '../checkbox';
import { ButtonComponent } from '../button';
import { IconButtonComponent } from '../icon-button';
import {
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItem,
} from '../actions-menu';
import {
  CardListComponentLabels,
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
  host: { class: 'app-card-list' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent {
  title = input.required<string>();
  listActions = input.required<ActionsMenuItem[]>();
  items = input.required<CardListItem[]>();
  itemActionsFn = input.required<CardListItemActionsFn>();
  labels = input<CardListComponentLabels>();
  withMutedTitle = input(false, { transform: booleanAttribute });
  isSelectable = input(true, { transform: booleanAttribute });
  _isPinned = input(true, { alias: 'isPinned', transform: booleanAttribute });
  withCounters = input(true, { transform: booleanAttribute });
  checkboxColor = input<CheckboxColor>('black');

  listActionClicked = output<string>();
  itemActionClicked = output<CardListItemActionOutput>();
  itemToggled = output<CardListItemToggledOutput>();
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

  itemActionsMap = new Map<string, ActionsMenuItem[]>();
  itemsDescriptionMap = new Map<string, boolean>();
  counters = signal<CardListCounters | null>(null);
  isCompleted = computed(() => this.computeIsCompleted());
  isPinned = signal(true);

  itemsEffect = effect(() => {
    const items = this.items();
    this.itemActionsMap = this.updateActionsByItemMap(items);
    if (this.withCounters()) {
      this.updateCounters(items);
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

  private updateActionsByItemMap(
    items: CardListItem[]
  ): Map<string, ActionsMenuItem[]> {
    const itemActionsMap = new Map<string, ActionsMenuItem[]>();
    const fn = this.itemActionsFn();
    items.forEach((item) => itemActionsMap.set(item.id, fn(item)));
    return itemActionsMap;
  }

  private updateCounters(items: CardListItem[]) {
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
