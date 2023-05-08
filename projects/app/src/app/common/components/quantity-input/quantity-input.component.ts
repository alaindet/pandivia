import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { DataSource, OnceSource } from '@app/common/sources';
import { AsyncPipe, NgIf } from '@angular/common';
import { getRandomHash } from '@app/common/utils';
import { ButtonComponent } from '../button';

const QUANTITY_INPUT_FORM_PROVIDER = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuantityInputComponent),
  multi: true,
};

const IMPORTS = [
  NgIf,
  AsyncPipe,
  MatIconModule,
  ButtonComponent,
];

@Component({
  selector: 'app-quantity-input',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss'],
  providers: [QUANTITY_INPUT_FORM_PROVIDER],
  host: { class: 'app-quantity-input' },
  encapsulation: ViewEncapsulation.None,
})
export class QuantityInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() id?: string;
  @Input() value = 1;
  @Input() min?: number;
  @Input() max?: number;
  @Input() @HostBinding('class.-disabled') isDisabled = false;

  @Output() changed = new EventEmitter<number>();

  private onChange?: (value: number) => void;
  private onTouched?: () => void;

  private once = new OnceSource();
  private _value$ = new DataSource<number>(1, this.once.event$);
  isMinusEnabled$ = this._value$.data$.pipe(map(this.isMinusEnabled.bind(this)));
  isPlusEnabled$ = this._value$.data$.pipe(map(this.isPlusEnabled.bind(this)));

  vm$ = combineLatest({
    value: this._value$.data$,
    isMinusEnabled: this.isMinusEnabled$,
    isPlusEnabled: this.isPlusEnabled$,
  });

  // @publicApi
  increment(): void {
    if (this.isDisabled) return;
    this._value$.next(value => value + 1);
  }

  // @publicApi
  decrement(): void {
    if (this.isDisabled) return;
    this._value$.next(value => value - 1);
  }

  ngOnInit() {
    if (!this.id) {
      const randomHash = getRandomHash(3);
      this.id = `app-quantity-input-${randomHash}`;
    }
  }

  ngOnDestroy() {
    this.once.trigger();
  }

  onIncrement() {
    if (this.isDisabled) return;
    this.increment();
    this.outputValue();
  }

  onDecrement() {
    if (this.isDisabled) return;
    this.decrement();
    this.outputValue();
  }

  // ControlValueAccessor
  writeValue(value: number | null | any): void {
    if (value === null || typeof value !== 'number') {
      return;
    }

    this._value$.next(value);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private isMinusEnabled(value: number): boolean {
    if (this.min === undefined) return true;
    return value > this.min;
  }

  private isPlusEnabled(value: number): boolean {
    if (this.max === undefined) return true;
    return value < this.max;
  }

  private outputValue(): void {
    const value = this._value$.getCurrent();
    if (this.onChange) this.onChange(value);
    if (this.onTouched) this.onTouched();
    this.changed.emit(value);
  }
}
