import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
  output,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { matArrowBack } from '@ng-icons/material-icons/baseline';

import { IconButtonComponent } from '../icon-button';

@Component({
  selector: 'app-page-header',
  imports: [IconButtonComponent, NgIcon],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
  host: { class: 'app-page-header' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  private location = inject(Location);

  withBackButton = input(false);
  withControlledBackButton = input(false);
  backLabel = input('Go back');

  backClicked = output<void>();

  matArrowBack = matArrowBack;

  onBackClicked() {
    if (this.withControlledBackButton()) {
      this.backClicked.emit();
      return;
    }

    if (this.withBackButton()) {
      this.location.back();
      return;
    }

    // Do nothing by default
  }
}
