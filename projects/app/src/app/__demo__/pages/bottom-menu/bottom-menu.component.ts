import { Component } from '@angular/core';

import { BottomMenuComponent, BottomMenuItem, BottomMenuItemComponent } from '@app/common/components';

const imports = [
  BottomMenuComponent,
  BottomMenuItemComponent,
];

@Component({
  selector: 'app-demo-bottom-navigation',
  standalone: true,
  imports,
  templateUrl: './bottom-menu.component.html',
  styleUrl: './bottom-menu.component.scss',
})
export class BottomMenuDemoPageComponent {

  menuItems: BottomMenuItem[] = [
    { id: 'lists', icon: 'list', label: 'Lists', },
    { id: 'current', icon: 'star', label: 'Items', },
    { id: 'user', icon: 'person', label: 'User', },
  ];

  currentItem: string | null = null;

  onSelectItem(id: string) {
    this.currentItem = id;
  }

  onClearSelectedItem() {
    this.currentItem = null;
  }
}
