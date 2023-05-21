import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ListItem } from '@app/features/list';
import { ButtonComponent } from '../../button';
import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItem, ActionsMenuItemDirective } from '../../menu/actions-menu';

const IMPORTS = [
  NgIf,
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItemDirective,
  MatIconModule,
  ButtonComponent,
];

@Component({
  selector: 'app-shopping-list-item',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-shopping-list-item' },
})
export class ShoppingListItemComponent implements OnChanges {

  @Input({ required: true }) item!: ListItem;
  @Input({ required: true }) actions!: ActionsMenuItem[];

  @Output() doneChanged = new EventEmitter<boolean>();

  @HostBinding('class.-done') cssDone = false;

  ngOnChanges() {
    this.cssDone = this.item.isDone;
  }

  onDone() {
    this.doneChanged.emit(!this.item.isDone);
  }

  onContextualMenuAction(action: string) {
    // ...
    console.log('onContextualMenuAction', action);
  }
}
