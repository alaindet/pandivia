import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bottom-menu-item',
  imports: [MatIconModule],
  templateUrl: './bottom-menu-item.component.html',
  styleUrl: './bottom-menu-item.component.scss',
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
