import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

type CosmeticCheckboxColor = 'primary' | 'secondary' | 'tertiary' | 'black';

@Component({
  selector: 'app-cosmetic-checkbox',
  standalone: true,
  template: '', // <-- Nothing to see here
  styleUrls: ['./cosmetic-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-cosmetic-checkbox' },
})
export class CosmeticCheckboxComponent {
  @Input() @HostBinding('class.-checked') checked = false;
  @Input() color: CosmeticCheckboxColor = 'primary';
  @Input() @HostBinding('style.--app-cosmetic-checkbox-size') size = '20px';
}
