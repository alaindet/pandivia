import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';

import { BottomMenuItemComponent } from '../bottom-menu-item/bottom-menu-item.component';
import { BottomMenuItem } from '../types';

@Component({
  selector: 'app-bottom-menu',
  imports: [BottomMenuItemComponent],
  templateUrl: './bottom-menu.component.html',
  styleUrl: './bottom-menu.component.css',
  host: { class: 'app-bottom-menu' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomMenuComponent {
  items = input<BottomMenuItem[]>([]);
  selectedItem = input<string | null>(null);

  selected = output<string>();
}
