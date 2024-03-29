import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

export type LinearSpinnerColor = 'primary' | 'secondary' | 'tertiary';

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

  @Input() @HostBinding('class.-fixed') fixed = false;

  @Input('color')
  set colorInput(color: LinearSpinnerColor) {
    this.cssClass = `-color-${color}`;
  }

  @HostBinding('class') cssClass = '-color-primary';
}
