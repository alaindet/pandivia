import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
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
  host: { class: 'app-icon-button' },
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

  @HostBinding('attr.type')
  get attributeType() {
    return this.type();
  }

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
      this.circled() ? '-circled' : null,
      !!this.floating ? `-floating -${this.floating()}` : null,
    ])
  );

  // @publicApi
  getNativeElement(): HTMLButtonElement {
    return this.host.nativeElement;
  }
}
