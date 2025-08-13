import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input
} from '@angular/core';

import { cssClassesList } from '@common/utils';

export type LinearSpinnerColor = 'primary' | 'secondary' | 'tertiary';

// Thanks to @alxhub
// https://github.com/angular/angular/issues/53888#issuecomment-1888071170
@Component({
  selector: 'app-linear-spinner',
  template: `<div class="_bar"><div></div></div>`,
  styleUrl: './linear-spinner.component.css',
  host: {
    '[class]': 'cssClasses()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinearSpinnerComponent {
  fixed = input(false, { transform: booleanAttribute });
  color = input<LinearSpinnerColor>('primary');

  cssClasses = computed(() => cssClassesList([
    'app-linear-spinner',
    this.fixed() ? '-fixed' : null,
    `-color-${this.color()}`,
  ]));
}
