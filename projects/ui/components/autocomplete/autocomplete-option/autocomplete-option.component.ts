import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  inject,
  input,
  output
} from '@angular/core';

@Component({
  selector: 'app-autocomplete-option',
  template: '<ng-content />',
  styleUrl: './autocomplete-option.component.css',
  host: {
    class: 'app-autocomplete-option',
    '[class.-focused]': 'isFocused()',
    '[attr.aria-selected]': 'isFocused()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AutocompleteOptionComponent {
  private host = inject(ElementRef);

  isDropdownOpen = input(false, { transform: booleanAttribute });
  isFocused = input(false, { transform: booleanAttribute });

  confirmed = output<void>();
  
  scrollEffect = effect(() => {
    if (this.isFocused() && this.isDropdownOpen()) {
      const scrollOptions = { behavior: 'smooth', block: 'nearest' };
      this.host.nativeElement.scrollIntoView(scrollOptions);
    }
  });
}
