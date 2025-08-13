import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input
} from '@angular/core';
import { cssClassesList } from '@common/utils';

export type IconButtonColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'outline'
  | 'ghost';

export type IconButtonSize = 'extra-small' | 'small' | 'medium' | 'large';

export type IconButtonFloatingType = 'container' | 'fixed';

@Component({
  selector: 'button[appIconButton]',
  template: '<ng-content />',
  styleUrl: './icon-button.component.css',
  host: {
    '[class]': 'cssClasses()',
    '[attr.type]': 'type()',
    '[style.--_top]': 'floatingTop()',
    '[style.--_right]': 'floatingRight()',
    '[style.--_bottom]': 'floatingBottom()',
    '[style.--left]': 'floatingLeft()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  private host = inject(ElementRef<HTMLButtonElement>);

  mainInput = input<IconButtonColor | null | ''>(null, {
    alias: 'appIconButton',
  });
  type = input<'button' | 'submit' | 'reset'>('button');
  color = input<IconButtonColor>('primary');
  size = input<IconButtonSize>('medium');
  circled = input(false, { transform: booleanAttribute });
  floating = input<IconButtonFloatingType | null>(null);
  floatingTop = input('auto');
  floatingRight = input('auto');
  floatingBottom = input('auto');
  floatingLeft = input('auto');

  private cssColorClass = computed(() => {
    const main = this.mainInput();
    const color = this.color();
    return cssClassesList([`-color-${!!main ? main : color}`]);
  });

  cssClasses = computed(() => cssClassesList([
    'app-icon-button',
    this.cssColorClass(),
    `-size-${this.size()}`,
    this.circled() ? '-circled' : null,
    !!this.floating ? `-floating -${this.floating()}` : null,
  ]));

  // @publicApi
  getNativeElement(): HTMLButtonElement {
    return this.host.nativeElement;
  }
}
