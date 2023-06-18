import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { BottomMenuItemComponent } from '../bottom-menu-item/bottom-menu-item.component';
import { BottomMenuItem } from '../types';

const imports = [
  CommonModule,
  BottomMenuItemComponent,
];

@Component({
  selector: 'app-bottom-menu',
  standalone: true,
  imports,
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.scss'],
  host: { class: 'app-bottom-menu' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomMenuComponent {

  @Input() items: BottomMenuItem[] = [];
  @Input() selectedItem: string | null = null;

  @Output() selected = new EventEmitter<string>();
}
