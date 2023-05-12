import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, Provider, SimpleChanges, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataSource, OnceSource } from '@app/common/sources';

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
export class SelectComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input() id?: string;
  @Input() value?: string;
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() options: FormOption[] = [];
  @Input() withDefaultOption = true;

  @ViewChild('selectRef', { static: true })
  private selectRef!: ElementRef<HTMLSelectElement>;

  @Output() selected = new EventEmitter<string | null>();

  private once = new OnceSource();
  private onChange!: (val: any) => {};
	private onTouched!: () => {};

  // selectedIndex$ = new DataSource<number | null>(number, this.once.event$);
  private selectedValue$ = new DataSource<string | null>(null, this.once.event$);
  selectedValue: string | null = null;

  ngOnInit() {
    if (!this.id) {
      this.id = `app-select-${getRandomHash(3)}`;
    }

    this.selectedValue$.data$.subscribe(x => this.selectedValue = x);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['value'])) {
      this.selectedValue$.next(this.value ?? null);
    }
  }

  ngOnDestroy() {
    this.once.trigger();
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
    this.selectedValue$.next(value);
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
    this.selectedValue$.next(value);
    if (this.onChange) this.onChange(value);
    if (this.onTouched) this.onTouched();
  }
}