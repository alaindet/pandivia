import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, inject, EventEmitter, Output } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '../button';

const IMPORTS = [
  NgIf,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-page-header' },
})
export class PageHeaderComponent {

  private location = inject(Location);

  @Input() withBackButton = false;
  @Input() withControlledBackButton = false;

  @Output() backClicked = new EventEmitter<void>();

  onBackClicked() {

    if (this.withControlledBackButton) {
      this.backClicked.emit();
      return;
    }

    if (this.withBackButton) {
      this.location.back();
      return;  
    }

    // Do nothing by default
  }
}
