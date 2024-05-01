import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, ViewEncapsulation, effect, inject, input, output } from '@angular/core';

@Component({
  selector: 'app-autocomplete-option',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrls: ['./autocomplete-option.component.scss'],
  host: { class: 'app-autocomplete-option' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AutocompleteOptionComponent {

  private host = inject(ElementRef);

  isDropdownOpen = input(false);
  isFocused = input(false);

  confirmed = output<void>();

  @HostBinding('class.-focused')
  get cssClassFocused() {
    return this.isFocused();
  }

  @HostBinding('attr.aria-selected')
  get attrAriaSelected() {
    return this.isFocused();
  }

  constructor() {
    effect(() => {
      if (this.isFocused() && this.isDropdownOpen()) {
        const scrollOptions = { behavior: 'smooth', block: 'nearest' };
        this.host.nativeElement.scrollIntoView(scrollOptions);
      }
    });
  }
}
