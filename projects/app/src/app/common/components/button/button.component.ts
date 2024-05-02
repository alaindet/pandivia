import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { asBoolean, cssClassesList } from '@app/common/utils';
import { ButtonColor, ButtonFloatingType, ButtonSize } from './types';

@Component({
  selector: 'button[appButton]',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrl: './button.component.scss',
  host: { class: 'app-button' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {

  private host = inject(ElementRef<HTMLButtonElement>);

  mainInput = input<ButtonColor | null | ''>(null, { alias: 'appButton' });
  color = input<ButtonColor>('primary');
  size = input<ButtonSize>('medium');
  isCircle = input<'' | boolean>(false);
  withIcon = input<'' | 'left' | 'right' | boolean>(false);
  withIconOnly = input<'' | boolean>(false);
  floating = input<ButtonFloatingType | null>(null);
  floatingTop = input('auto');
  floatingRight = input('1rem');
  floatingBottom = input('1rem');
  floatingLeft = input('auto');

  @HostBinding('style.--app-button-top')
  get styleTop() {
    return this.floatingTop();
  }

  @HostBinding('style.--app-button-right')
  get styleRight() {
    return this.floatingRight();
  }

  @HostBinding('style.--app-button-bottom')
  get styleBottom() {
    return this.floatingBottom();
  }

  @HostBinding('style.--app-button-left')
  get styleLeft() {
    return this.floatingLeft();
  }

  @HostBinding('class')
  get cssClass() {
    return this.cssClasses();
  }

  private cssColorClass = computed(() => {
    const main = this.mainInput();
    const color = this.color();
    return `-color-${!!main ? main : color}`;
  });

  private cssIconColorClass = computed(() => {
    switch (this.withIcon()) {
      case 'left':
      case 'right':
        return `-with-icon -${this.withIcon() }`;
      case true:
      case '':
        return '-with-icon';
      case false:
      default:
        return null;
    }
  });

  private cssClasses = computed(() => cssClassesList([
    this.cssColorClass(),
    `-size-${this.size}`,
    this.cssIconColorClass(),
    asBoolean(this.withIconOnly) ? '-with-icon-only' : null,
    asBoolean(this.isCircle) ? '-circle' : null,
    !!this.floating ? `-floating-${this.floating}` : null,
  ]));

  // Public API
  getNativeElement(): HTMLButtonElement {
    return this.host.nativeElement;
  }
}
