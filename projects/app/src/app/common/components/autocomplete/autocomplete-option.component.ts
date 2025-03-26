import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  ViewEncapsulation,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-autocomplete-option',
  template: '<ng-content></ng-content>',
  styleUrl: './autocomplete-option.component.css',
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

  scrollEffect = effect(() => {
    if (this.isFocused() && this.isDropdownOpen()) {
      const scrollOptions = { behavior: 'smooth', block: 'nearest' };
      this.host.nativeElement.scrollIntoView(scrollOptions);
    }
  });
}
