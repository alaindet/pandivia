import {
  Component,
  Injector,
  Provider,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  output,
  runInInjectionContext
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { uniqueId } from '@common/utils';
import { NgIcon } from '@ng-icons/core';
import { matAdd, matRemove } from '@ng-icons/material-icons/baseline';

import { IconButtonColor, IconButtonComponent } from '../icon-button';

const QUICK_NUMBER_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuickNumberComponent),
  multi: true,
};

@Component({
  selector: 'app-quick-number',
  imports: [NgIcon, ReactiveFormsModule, IconButtonComponent],
  templateUrl: './quick-number.component.html',
  styleUrl: './quick-number.component.css',
  host: {
    class: 'app-quick-number',
    '[class.-full-width]': 'fullWidth()',
    '[attr.id]': 'id()',
    '[attr.aria-errormessage]': 'withErrorId()',
  },
  encapsulation: ViewEncapsulation.None,
  providers: [QUICK_NUMBER_FORM_PROVIDER],
})
export class QuickNumberComponent implements ControlValueAccessor {
  private injector = inject(Injector);

  _id = input<string>('', { alias: 'id' });
  _value = input(1, { alias: 'value', transform: numberAttribute });
  color = input<IconButtonColor>('primary');
  min = input(0, { transform: numberAttribute });
  max = input(100, { transform: numberAttribute });
  _isDisabled = input(false, {
    alias: 'isDisabled',
    transform: booleanAttribute,
  });
  withErrorId = input<string | null>(null);
  fullWidth = input(false, { transform: booleanAttribute });
  i18nDecrement = input('Decrement by one');
  i18nIncrement = input('Increment by one');

  changed = output<number>();

  icon = { matAdd, matRemove };

  value = linkedSignal(() => this._value());
  isDisabled = linkedSignal(() => this._isDisabled());
  isDecrementDisabled = computed(() => this.value() <= this.min());
  isIncrementDisabled = computed(() => this.value() >= this.max());
  id = computed(() => uniqueId(this._id(), 'app-quick-number'));

  private onChange!: (value: number | null) => void;
  private onTouched!: () => void;

  // @publicApi
  decrement() {
    if (this.isDisabled()) return;
    this.value.update((value) => value - 1);
  }

  // @publicApi
  increment() {
    if (this.isDisabled()) return;
    this.value.update((value) => value + 1);
  }

  onDecrement() {
    this.updateAndOutputValue((value) => value - 1);
  }

  onIncrement() {
    this.updateAndOutputValue((value) => value + 1);
  }

  // ControlValueAccessor
  writeValue(value: number | null | any): void {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        const newValue =
          value === null || typeof value !== 'number' ? 1 : value;
        this.value.set(newValue);
      });
    });
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
