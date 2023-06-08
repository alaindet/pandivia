import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, Provider, SimpleChanges, ViewChild, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FormOption } from '@app/common/types';
import { didInputChange, getRandomHash } from '@app/common/utils';

const SELECT_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => SelectComponent),
	multi: true,
};

const IMPORTS = [
  NgFor,
  NgIf,
  AsyncPipe,
];

@Component({
  selector: 'app-select',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  host: { class: 'app-select' },
  encapsulation: ViewEncapsulation.None,
  providers: [SELECT_FORM_PROVIDER],
})
export class SelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() id?: string;
  @Input() value?: string;
  @Input() status?: 'success' | 'error';
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() options: FormOption[] = [];
  @Input() width?: string;
  @Input() withDefaultOption = true;

  @ViewChild('selectRef', { static: true })
  private selectRef!: ElementRef<HTMLSelectElement>;

  @Output() selected = new EventEmitter<string | null>();

  @HostBinding('style.--app-select-width') cssWidth = '';
  @HostBinding('class') cssClass = '';

  private onChange!: (val: any) => {};
	private onTouched!: () => {};

  selectedValue = signal<string | null>(null);

  ngOnInit() {
    // Use uniqueId()
    if (!this.id) {
      this.id = `app-select-${getRandomHash(3)}`;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['value'])) {
      this.selectedValue.set(this.value ?? null);
    }

    if (didInputChange(changes['width'])) {
      this.cssWidth = !!this.width ? this.width : 'fit-content';
    }

    if (didInputChange(changes['status'])) {
      this.updateStyle();
    }
  }

  // Thanks to https://linuxhint.com/select-onchange-javascript/
  onSelectChange() {

    let index = this.selectRef.nativeElement.selectedIndex;

    if (this.withDefaultOption && index === 0) {
      this.outputValue(null);
      return;
    }

    if (this.withDefaultOption) {
      index -= 1;
    }

    const option = this.options[index];
    this.outputValue(option.value);
  }

  // From ControlValueAccessor
	writeValue(value: string | null): void {
    this.selectedValue.set(value);
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

  private outputValue(value: string | null): void {
    this.selectedValue.set(value);
    this.selected.emit(value);
    if (this.onChange) this.onChange(value);
    if (this.onTouched) this.onTouched();
  }

  private updateStyle(): void {
    if (this.status) {
      this.cssClass = `-status-${this.status}`;
    } else {
      this.cssClass = '';
    }
  }
}
