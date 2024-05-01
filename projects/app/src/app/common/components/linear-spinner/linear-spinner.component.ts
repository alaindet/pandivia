import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation, input } from '@angular/core';

export type LinearSpinnerColor = 'primary' | 'secondary' | 'tertiary';

// Thanks to @alxhub
// https://github.com/angular/angular/issues/53888#issuecomment-1888071170
@Component({
  selector: 'app-linear-spinner',
  standalone: true,
  template: `<div class="_bar"><div>`,
  styleUrls: ['./linear-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-linear-spinner' },
})
export class LinearSpinnerComponent {

  fixed = input(false);
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
