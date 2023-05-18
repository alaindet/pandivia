import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

// const IMPORTS = [

// ];

@Component({
  selector: 'app-linear-spinner',
  standalone: true,
  // imports: IMPORTS,
  template: `<div class="_bar"><div>`,
  styleUrls: ['./linear-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinearSpinnerComponent {
  @Input() @HostBinding('class.-fixed') fixed = false;
}