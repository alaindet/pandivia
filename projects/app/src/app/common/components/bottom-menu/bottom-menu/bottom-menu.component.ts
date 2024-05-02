import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';

import { BottomMenuItemComponent } from '../bottom-menu-item/bottom-menu-item.component';
import { BottomMenuItem } from '../types';

const imports = [
  BottomMenuItemComponent,
];

@Component({
  selector: 'app-bottom-menu',
  standalone: true,
  imports,
  templateUrl: './bottom-menu.component.html',
  styleUrl: './bottom-menu.component.scss',
  host: { class: 'app-bottom-menu' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomMenuComponent {

  items = input<BottomMenuItem[]>([]);
  selectedItem = input<string | null>(null);

  selected = output<string>();
}
