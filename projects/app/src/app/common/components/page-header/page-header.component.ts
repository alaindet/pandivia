import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '../button';

@Component({
  selector: 'app-page-header',
  imports: [ButtonComponent, MatIconModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  host: { class: 'app-page-header' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  private location = inject(Location);

  withBackButton = input(false);
  withControlledBackButton = input(false);

  backClicked = output<void>();

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
