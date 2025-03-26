import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';

import { asBoolean, cssClassesList } from '@app/common/utils';
import {
  IconButtonColor,
  IconButtonFloatingType,
  IconButtonSize,
} from './types';

@Component({
  selector: 'button[appIconButton]',
  template: '<ng-content />',
  styleUrl: './icon-button.component.scss',
  host: { class: 'app-icon-button' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  private host = inject(ElementRef<HTMLButtonElement>);

  mainInput = input<IconButtonColor | null | ''>(null, {
    alias: 'appIconButton',
  });
  color = input<IconButtonColor>('primary');
  size = input<IconButtonSize>('medium');
  circled = input<'' | boolean>(false);
  floating = input<IconButtonFloatingType | null>(null);
  floatingTop = input('auto');
  floatingRight = input('1rem');
  floatingBottom = input('1rem');
  floatingLeft = input('auto');

  @HostBinding('style.--_top')
  get styleTop() {
    return this.floatingTop();
  }

  @HostBinding('style.--_right')
  get styleRight() {
    return this.floatingRight();
  }

  @HostBinding('style.--_bottom')
  get styleBottom() {
    return this.floatingBottom();
  }

  @HostBinding('style.--_left')
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
    return cssClassesList([`-color-${!!main ? main : color}`]);
  });

  private cssClasses = computed(() =>
    cssClassesList([
      this.cssColorClass(),
      `-size-${this.size()}`,
      asBoolean(this.circled()) ? '-circled' : null,
      !!this.floating ? `-floating -${this.floating()}` : null,
    ])
  );

  // @publicApi
  getNativeElement(): HTMLButtonElement {
    return this.host.nativeElement;
  }
}
