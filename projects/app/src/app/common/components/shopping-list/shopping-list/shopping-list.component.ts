import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { NgFor } from '@angular/common';

const IMPORTS = [
  NgFor,
];

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-shopping-list' },
})
export class ShoppingListComponent {
  
}
