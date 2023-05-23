import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BottomNavigationComponent, BottomNavigationItemComponent } from '@app/common/components';

const IMPORTS = [
  CommonModule,
  BottomNavigationComponent,
  BottomNavigationItemComponent,
];

@Component({
  selector: 'app-demo-bottom-navigation',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
})
export class BottomNavigationDemoPageComponent {

  navigationItems: any[] = [
    { id: 'lists', icon: 'list', label: 'Lists', },
    { id: 'current', icon: 'star', label: 'Items', },
    { id: 'user', icon: 'person', label: 'User', },
  ];

  currentNavigationItem: string | null = null;

  onNavigate(id: string) {
    this.currentNavigationItem = id;
  }

  onClearNavigation() {
    this.currentNavigationItem = null;
  }
}
