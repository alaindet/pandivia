import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';

import { asBoolean, cssClassesList } from '@app/common/utils';

export type ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
export type ButtonSize = 'extra-small' | 'small' | 'medium' | 'large';
export type ButtonFloatingType = 'container' | 'fixed';

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
  @Input() @HostBinding('style.--app-button-top') floatingTop = 'auto';
  @Input() @HostBinding('style.--app-button-right') floatingRight = '1rem';
  @Input() @HostBinding('style.--app-button-bottom') floatingBottom = '1rem';
  @Input() @HostBinding('style.--app-button-left') floatingLeft = 'auto';

  @HostBinding('class') cssClasses!: string;

  private skipInit = false;

  // Public API
  getNativeElement(): HTMLButtonElement {
    return this.host.nativeElement;
  }

  ngOnInit() {
    if (!this.skipInit) this.updateStyle();
  }

  ngOnChanges() {
    this.skipInit = true;
    this.updateStyle();
  }

  private updateStyle(): void {
    this.cssClasses = cssClassesList([
      this.getColorCss(this.mainInput, this.color),
      `-size-${this.size}`,
      this.getWithIconCss(this.withIcon),
      asBoolean(this.withIconOnly) ? '-with-icon-only' : null,
      asBoolean(this.isCircle) ? '-circle' : null,
      !!this.floating ? `-floating-${this.floating}` : null,
    ]);
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
}
