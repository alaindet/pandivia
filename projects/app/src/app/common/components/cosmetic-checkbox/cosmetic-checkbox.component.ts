import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

type CosmeticCheckboxColor = 'primary' | 'secondary' | 'tertiary' | 'black';

@Component({
  selector: 'app-cosmetic-checkbox',
  standalone: true,
  template: `
    <span class="_checkmark"></span>
    <span class="_content"><ng-content></ng-content></span>
  `,
  styleUrls: ['./cosmetic-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-cosmetic-checkbox',
    role: 'checkbox',
  },
})
export class CosmeticCheckboxComponent {

  @Input()
  @HostBinding('class.-checked')
  @HostBinding('attr.aria-checked')
  checked = false;

  @Input()
  @HostBinding('style.--app-cosmetic-checkbox-size')
  size = '20px';

  @Input()
  set color(val: CosmeticCheckboxColor) {
    this.cssClasses = `-color-${val}`;
  }

  @Input()
  set isInteractable(val: boolean) {
    this.cssIsInteractable = val;
    this.tabIndex = val ? '0' : '-1';
  }

  @HostBinding('class') cssClasses = '-color-primary';
  @HostBinding('class.-interactable') cssIsInteractable = true;
  @HostBinding('tabindex') tabIndex = '0';
}
