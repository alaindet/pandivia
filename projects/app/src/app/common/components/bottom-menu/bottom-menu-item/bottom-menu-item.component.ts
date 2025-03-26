import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation,
  input,
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
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomMenuItemComponent {
  id = input.required<string>();
  icon = input.required<string>();
  isSelected = input(false);

  @HostBinding('class.-selected')
  get cssClassSelected() {
    return this.isSelected();
  }
}
