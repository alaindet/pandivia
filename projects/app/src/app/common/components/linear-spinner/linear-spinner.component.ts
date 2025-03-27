import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';

export type LinearSpinnerColor = 'primary' | 'secondary' | 'tertiary';

// Thanks to @alxhub
// https://github.com/angular/angular/issues/53888#issuecomment-1888071170
@Component({
  selector: 'app-linear-spinner',
  template: `<div class="_bar"><div></div></div>`,
  styleUrl: './linear-spinner.component.css',
  host: { class: 'app-linear-spinner' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinearSpinnerComponent {
  fixed = input(false, { transform: booleanAttribute });
  color = input<LinearSpinnerColor>('primary');

  @HostBinding('class.-fixed')
  get cssClassFixed() {
    return this.fixed();
  }

  @HostBinding('class')
  get cssClass() {
    return `-color-${this.color()}`;
  }
}
