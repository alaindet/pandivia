import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';

import { asBoolean, cssClassesList } from '@app/common/utils';

type ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonFloatingType = 'container' | 'fixed';
type ButtonFloatingPosition = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

@Component({
  selector: 'button[appButton]',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrls: ['./button.component.scss'],
  host: { class: 'app-button' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit {

  private host = inject(ElementRef<HTMLButtonElement>);

  @Input('appButton') mainInput: ButtonColor | null | '' = null;
  @Input() color: ButtonColor = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() isCircle: '' | boolean = false;
  @Input() withIcon: '' | 'left' | 'right' | boolean = false;
  @Input() withIconOnly: '' | boolean = false;
  @Input() floating: ButtonFloatingType | null = null;
  @Input() floatingPos: ButtonFloatingPosition | null = null;

  @HostBinding('class') cssClasses!: string;
  @HostBinding('style.--app-button-top') cssTop = 'auto';
  @HostBinding('style.--app-button-right') cssRight = '1rem';
  @HostBinding('style.--app-button-bottom') cssBottom = '1rem';
  @HostBinding('style.--app-button-left') cssLeft = 'auto';

  // Public API
  getNativeElement(): HTMLButtonElement {
    return this.host.nativeElement;
  }

  ngOnInit() {
    this.cssClasses = cssClassesList([
      this.getColorCss(this.mainInput, this.color),
      `-size-${this.size}`,
      this.getWithIconCss(this.withIcon),
      asBoolean(this.withIconOnly) ? '-with-icon-only' : null,
      asBoolean(this.isCircle) ? '-circle' : null,
      !!this.floating ? `-floating-${this.floating}` : null,
    ]);

    this.updateFloatingPosition();
  }

  private getColorCss(main: ButtonColor | null | '', color: ButtonColor): string | null {
    const existingColor = !!main ? main : color;
    return `-color-${existingColor}`;
  }

  private getWithIconCss(withIcon: '' | 'left' | 'right' | boolean): string | null {
    switch (withIcon) {
      case 'left':
      case 'right':
        return `-with-icon -${withIcon}`;
      case true:
      case '':
        return '-with-icon';
      case false:
      default:
        return null;
    }
  }

  private updateFloatingPosition(): void {

    if (this.floatingPos === null) {
      return;
    }

    for (const [pos, value] of Object.entries(this.floatingPos)) {
      switch (pos) {
        case 'top':
          this.cssTop = value;
          break;
        case 'right':
          this.cssRight = value;
          break;
        case 'bottom':
          this.cssBottom = value;
          break;
        case 'left':
          this.cssLeft = value;
          break;
      }
    }
  }
}
