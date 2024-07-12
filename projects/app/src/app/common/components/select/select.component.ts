import { Component, ElementRef, HostBinding, Provider, ViewEncapsulation, computed, effect, forwardRef, input, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

import { FormFieldStatus, FormOption } from '@app/common/types';
import { cssClassesList, uniqueId } from '@app/common/utils';
import { SelectComponentLabels } from './types';

const SELECT_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => SelectComponent),
	multi: true,
};

const imports = [
  TranslocoModule,
];

@Component({
  selector: 'app-select',
  standalone: true,
  imports,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  host: { class: 'app-select' },
  encapsulation: ViewEncapsulation.None,
  providers: [SELECT_FORM_PROVIDER],
})
export class SelectComponent implements ControlValueAccessor {

  _id = input<string>('', { alias: 'id' });
  value = input<string>();
  status = input<FormFieldStatus>()
  _isDisabled = input(false, { alias: 'isDisabled' });
  options = input<FormOption[]>([]);
  width = input<string>();
  withDefaultOption = input(true);
  labels = input<SelectComponentLabels>();

  selected = output<string | null>();

  @HostBinding('class.-disabled')
  get cssClassDisabled() {
    return this.isDisabled();
  }

  @HostBinding('style.--_width')
  get getStyleWidth() {
    return this.styleWidth();
  }

  @HostBinding('class')
  get getCssClass() {
    return this.cssClass();
  }

  @HostBinding('class.-with-custom-width')
  get getCssClassWithCustomWidth() {
    return this.width() !== undefined;
  }

  selectedValue = signal<string | null>(null);
  isDisabled = signal(false);
  id = computed(() => uniqueId(this._id(), 'app-select'));
  styleWidth = computed(() => this.width() ?? 'fit-content');
  cssClass = computed(() => cssClassesList([
    this.status() ? `-status-${this.status()}` : null,
  ]));

  private selectRef = viewChild.required<ElementRef<HTMLSelectElement>>('selectRef');
  private onChange!: (val: any) => {};
	private onTouched!: () => {};

  valueEffect = effect(() => this.selectedValue.set(this.value() ?? null), {
    allowSignalWrites: true,
  });

  disabledEffect =  effect(() => this.isDisabled.set(this._isDisabled()), {
    allowSignalWrites: true,
  });

  // Thanks to https://linuxhint.com/select-onchange-javascript/
  onSelectChange() {

    let index = this.selectRef().nativeElement.selectedIndex;

    if (this.withDefaultOption() && index === 0) {
      this.outputValue(null);
      return;
    }

    if (this.withDefaultOption()) {
      index -= 1;
    }

    const option = this.options()[index];
    this.outputValue(option.value);
  }

  private outputValue(value: string | null): void {
    this.selectedValue.set(value);
    this.selected.emit(value);
    if (this.onChange) this.onChange(value);
    if (this.onTouched) this.onTouched();
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
    this.isDisabled.set(isDisabled);
  }
}
