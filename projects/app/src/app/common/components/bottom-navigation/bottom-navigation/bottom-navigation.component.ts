import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { BottomNavigationItemComponent } from '../bottom-navigation-item/bottom-navigation-item.component';
import { BottomNavigationItem } from '../types';

const IMPORTS = [
  CommonModule,
  BottomNavigationItemComponent,
];

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
  host: { class: 'app-bottom-navigation' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavigationComponent {

  @Input() items: BottomNavigationItem[] = [];
  @Input() selectedItem: string | null = null;

  @Output() selected = new EventEmitter<string>();
}
