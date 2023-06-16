import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
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

  @Input() id!: string;
  @Input() icon!: string;
  @Input() @HostBinding('class.-selected') isSelected = false;
}
