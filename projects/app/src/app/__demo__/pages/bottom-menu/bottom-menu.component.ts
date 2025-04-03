import { Component } from '@angular/core';
import { matList, matPerson, matStar } from '@ng-icons/material-icons/baseline';

import { BottomMenuComponent, BottomMenuItem } from '@fruit/components';

@Component({
  selector: 'app-demo-bottom-navigation',
  imports: [BottomMenuComponent],
  templateUrl: './bottom-menu.component.html',
  styleUrl: './bottom-menu.component.css',
})
export class BottomMenuDemoPageComponent {
  menuItems: BottomMenuItem[] = [
    { id: 'lists', label: 'Lists', icon: matList },
    { id: 'current', label: 'Items', icon: matStar },
    { id: 'user', label: 'User', icon: matPerson },
  ];

  currentItem: string | null = null;

  onSelectItem(id: string) {
    this.currentItem = id;
  }

  onClearSelectedItem() {
    this.currentItem = null;
  }
}
