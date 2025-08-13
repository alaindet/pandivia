import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-bottom-menu-item',
  imports: [NgIcon],
  templateUrl: './bottom-menu-item.component.html',
  styleUrl: './bottom-menu-item.component.css',
  host: {
    class: 'app-bottom-menu-item',
    tabindex: '0',
    '[class.-selected]': 'isSelected()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomMenuItemComponent {
  id = input.required<string>();
  icon = input.required<string>();
  isSelected = input(false, { transform: booleanAttribute });
}
