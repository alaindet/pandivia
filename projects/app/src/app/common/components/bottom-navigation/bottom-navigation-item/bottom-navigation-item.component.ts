import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { BOTTOM_NAVIGATION_ITEM_ICON, BottomNavigationItemIcon } from './types';

const ICON_MAP: { [key in BottomNavigationItemIcon]: string } = {
  [BOTTOM_NAVIGATION_ITEM_ICON.LIST]: 'format_list_bulleted',
  [BOTTOM_NAVIGATION_ITEM_ICON.STAR]: 'star',
  [BOTTOM_NAVIGATION_ITEM_ICON.USER]: 'person',
};

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

  @Input('icon')
  set iconInput(val: BottomNavigationItemIcon) {
    this.icon = ICON_MAP[val];
  }
  icon!: string;

  @Input() @HostBinding('class.-selected') isSelected = false;
}
