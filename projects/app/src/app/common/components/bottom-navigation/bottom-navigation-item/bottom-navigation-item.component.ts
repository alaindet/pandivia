import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

const IMPORTS = [
  MatIconModule,
];

@Component({
  selector: 'app-bottom-navigation-item',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './bottom-navigation-item.component.html',
  styleUrls: ['./bottom-navigation-item.component.scss'],
  host: {
    class: 'app-bottom-navigation-item',
    tabindex: '0',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavigationItemComponent {

  @Input() id!: string;
  @Input() icon!: string;
  @Input() @HostBinding('class.-selected') isSelected = false;
}
