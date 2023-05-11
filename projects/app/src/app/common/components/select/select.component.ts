import { Component, EventEmitter, HostBinding, Input, OnInit, Output, Provider, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { getRandomHash } from '@app/common/utils';

const SELECT_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => SelectComponent),
	multi: true,
};

const IMPORTS = [
  // ...
];

@Component({
  selector: 'app-select',
  standalone: true,
  // imports: IMPORTS,
  template: './select.component.html',
  styleUrls: ['./select.component.scss'],
  host: { class: 'app-select' },
  encapsulation: ViewEncapsulation.None,
  providers: [SELECT_FORM_PROVIDER],
})
export class SelectComponent implements OnInit, ControlValueAccessor {

  @Input() id?: string;
  @Input() @HostBinding('class.-disabled') isDisabled = false;

  @Output() selected = new EventEmitter<string | null>();

  private onChange!: (val: any) => {};
	private onTouched!: () => {};

  ngOnInit() {
    if (!this.id) {
      this.id = `app-select-${getRandomHash(3)}`;
    }
  }

  // From ControlValueAccessor
	writeValue(value: any): void {
    // ...
	}

	// From ControlValueAccessor
	registerOnChange(fn: (val: any) => {}): void {
		this.onChange = fn;
	}

	// From ControlValueAccessor
	registerOnTouched(fn: () => {}): void {
		this.onTouched = fn;
	}

  // From ControlValueAccessor
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}