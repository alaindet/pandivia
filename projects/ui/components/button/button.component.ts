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

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'outline'
  | 'ghost';

export type ButtonSize = 'extra-small' | 'small' | 'medium' | 'large';

@Component({
  selector: 'button[appButton]',
  template: '<ng-content />',
  styleUrl: './button.component.css',
  host: {
    '[class]': 'cssClasses()',
    '[attr.type]': 'type()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private host = inject(ElementRef<HTMLButtonElement>);

  mainInput = input<ButtonColor | null | ''>(null, { alias: 'appButton' });
  type = input<'button' | 'submit' | 'reset'>('button');
  color = input<ButtonColor>('primary');
  size = input<ButtonSize>('medium');
  fullWidth = input(false, { transform: booleanAttribute });
  withIcon = input<'' | 'left' | 'right' | boolean>(false);

  private cssIconColorClass = computed(() => {
    switch (this.withIcon()) {
      case 'left':
      case 'right':
        return `-with-icon -${this.withIcon()}`;
      case true:
      case '':
        return '-with-icon';
      case false:
      default:
        return null;
    }
  });

  private cssClasses = computed(() => {
    const main = this.mainInput();
    const color = this.color();

    return cssClassesList([
      'app-button',
      `-color-${!!main ? main : color}`,
      this.fullWidth() ? '-full-width' : null,
      `-size-${this.size()}`,
      this.cssIconColorClass(),
    ]);
  });

  // @publicApi
  getNativeElement(): HTMLButtonElement {
    return this.host.nativeElement;
  }
}
