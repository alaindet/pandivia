import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { NgFor } from '@angular/common';

import { didInputChange } from '@app/common/utils';
import { ShoppingListService } from '../shopping-list.service';

const IMPORTS = [
  NgFor,
];

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: IMPORTS,
  template: '<ng-content></ng-content>',
  styleUrls: ['./shopping-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-shopping-list' },
  providers: [ShoppingListService],
})
export class ShoppingListComponent implements OnChanges {

  private svc = inject(ShoppingListService);

  @Input() isSelectable = false;

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['isSelectable'])) {
      this.isSelectable
        ? this.svc.enableSelectability()
        : this.svc.disableSelectability();
    }
  }
}
