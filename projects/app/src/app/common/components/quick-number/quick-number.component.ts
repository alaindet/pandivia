import { Component, HostBinding, Provider, ViewEncapsulation, computed, effect, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { uniqueId } from '@app/common/utils';
import { ButtonColor, ButtonComponent } from '../button';

const QUICK_NUMBER_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuickNumberComponent),
  multi: true,
};

const imports = [
  MatIconModule,
  ReactiveFormsModule,
  ButtonComponent,
];

@Component({
  selector: 'app-quick-number',
  standalone: true,
  imports,
  templateUrl: './quick-number.component.html',
  styleUrl: './quick-number.component.scss',
  host: { class: 'app-quick-number' },
  encapsulation: ViewEncapsulation.None,
  providers: [QUICK_NUMBER_FORM_PROVIDER],
})
export class QuickNumberComponent implements ControlValueAccessor {

  _id = input<string>('', { alias: 'id' });
  _value = input<number>(1, { alias: 'value' });
  color = input<ButtonColor>('primary');
  min = input<number>(0);
  max = input<number>(100);
  _isDisabled = input(false, { alias: 'isDisabled' });
  withErrorId = input<string | null>(null);
  withFullWidth = input(false);

  changed = output<number>();

  @HostBinding('attr.aria-errormessage')
  get attrAriaErrorMessage() {
    return this.withErrorId();
  }

  @HostBinding('attr.id')
  get attrId() {
    return this.id();
  }

  @HostBinding('class.-full-width')
  get cssClassFullWidth() {
    return this.withFullWidth();
  }

  value = signal<number>(1);
  isDisabled = signal(false);
  isDecrementDisabled = computed(() => this.value() <= this.min());
  isIncrementDisabled = computed(() => this.value() >= this.max());
  id = computed(() => uniqueId(this._id(), 'app-quick-number'));

  private onChange!: (value: number | null) => void;
  private onTouched!: () => void;

  constructor() {
    effect(() => this.value.set(this._value()), { allowSignalWrites: true });
    effect(() => this.isDisabled.set(this._isDisabled()), { allowSignalWrites: true });
  }

  // @publicApi
  decrement() {
    if (this.isDisabled()) return;
    this.value.update(value => value - 1);
  }

  // @publicApi
  increment() {
    if (this.isDisabled()) return;
    this.value.update(value => value + 1);
  }

  onDecrement() {
    this.updateAndOutputValue(value => value - 1);
  }

  onIncrement() {
    this.updateAndOutputValue(value => value + 1);
  }

  // ControlValueAccessor
  writeValue(value: number | null | any): void {
    const newValue = (value === null || typeof value !== 'number') ? 1 : value;
    this.value.set(newValue);
  }

  // ControlValueAccessor
  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  // ControlValueAccessor
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // ControlValueAccessor
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private updateAndOutputValue(fn: (value: number) => number) {

    const newValue = fn(this.value());
    this.changed.emit(newValue);

    if (this.onChange) {
      this.onChange(newValue);
    }

    if (this.onTouched) {
      this.onTouched();
    }

    this.value.set(newValue);
  }
}
