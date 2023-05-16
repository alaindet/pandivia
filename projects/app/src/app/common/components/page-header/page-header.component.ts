import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, inject } from '@angular/core';
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

  onBackClicked() {
    this.location.back();
  }
}
