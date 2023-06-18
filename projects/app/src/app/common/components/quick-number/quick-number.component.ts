import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, Provider, SimpleChanges, ViewEncapsulation, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { didInputChange, uniqueId } from '@app/common/utils';
import { ButtonComponent } from '../button';

const QUICK_NUMBER_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuickNumberComponent),
  multi: true,
};

const imports = [
  NgIf,
  AsyncPipe,
  MatIconModule,
  ReactiveFormsModule,
  ButtonComponent,
];

@Component({
  selector: 'app-quick-number',
  standalone: true,
  imports,
  templateUrl: './quick-number.component.html',
  styleUrls: ['./quick-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [QUICK_NUMBER_FORM_PROVIDER],
  host: { class: 'app-quick-number' },
})
export class QuickNumberComponent implements OnChanges, OnInit, ControlValueAccessor {

  @Input() id?: string;
  @Input('value') _value = 1;
  @Input() min?: number;
  @Input() max?: number;
  @Input() isDisabled = false;
  @Input() @HostBinding('attr.aria-errormessage') withErrorId: string | null = null;

  @Output() changed = new EventEmitter<number>();

  value = signal<number>(1);

  isDecrementDisabled = computed(() => {
    return (this.min === undefined) ? false : this.value() <= this.min;
  });

  isIncrementDisabled = computed(() => {
    return (this.max === undefined) ? false : this.value() >= this.max;
  });

  private onChange!: (value: number | null) => void;
  private onTouched!: () => void;

  ngOnInit() {
    this.id = uniqueId(this.id, 'app-quick-number');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['_value'])) {
      this.value.set(this._value ?? null);
    }
  }

  // @publicApi
  decrement() {
    if (this.isDisabled) return;
    this.value.update(value => value - 1);
  }

  // @publicApi
  increment() {
    if (this.isDisabled) return;
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
    this.isDisabled = isDisabled;
  }

  private updateAndOutputValue(fn: (value: number) => number) {
    const newValue = fn(this.value());
    this.changed.emit(newValue);
    if (this.onChange) this.onChange(newValue);
    if (this.onTouched) this.onTouched();
    this.value.set(newValue);
  }
}
