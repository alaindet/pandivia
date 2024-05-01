import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

const imports = [
  MatIconModule,
];

@Component({
  selector: 'app-bottom-menu-item',
  standalone: true,
  imports,
  templateUrl: './bottom-menu-item.component.html',
  styleUrls: ['./bottom-menu-item.component.scss'],
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
