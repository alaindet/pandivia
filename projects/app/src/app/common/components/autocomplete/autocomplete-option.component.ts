import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output, ViewEncapsulation, inject } from '@angular/core';

@Component({
  selector: 'app-autocomplete-option',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrls: ['./autocomplete-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-autocomplete-option' },
})
export class AutocompleteOptionComponent implements OnChanges {

  private host = inject(ElementRef);

  @Input()
  isDropdownOpen = false;

  @Input()
  @HostBinding('class.-focused')
  @HostBinding('attr.aria-selected')
  isFocused = false;

  @Output() confirmed = new EventEmitter<void>();

  ngOnChanges() {
    if (this.isFocused && this.isDropdownOpen) {
      const scrollOptions = { behavior: 'smooth', block: 'nearest' };
      this.host.nativeElement.scrollIntoView(scrollOptions);
    }
  }
}
