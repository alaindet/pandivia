import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, Provider, SimpleChanges, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, map } from 'rxjs';

import { DataSource, EventSource, OnceSource } from '@app/common/sources';
import { didInputChange } from '@app/common/utils';
import { ButtonComponent } from '../button';

const QUICK_NUMBER_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuickNumberComponent),
  multi: true,
};

const IMPORTS = [
  NgIf,
  AsyncPipe,
  MatIconModule,
  ReactiveFormsModule,
  ButtonComponent,
];

@Component({
  selector: 'app-quick-number',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quick-number.component.html',
  styleUrls: ['./quick-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [QUICK_NUMBER_FORM_PROVIDER],
  host: { class: 'app-quick-number' },
})
export class QuickNumberComponent implements OnChanges, OnDestroy, ControlValueAccessor {

  @Input() value = 1;
  @Input() min?: number;
  @Input() max?: number;
  @Input() isDisabled = false;

  @Output() changed = new EventEmitter<number>();

  private once = new OnceSource();
  private value$ = new DataSource<number>(this.value, this.once.event$);
  private onChange!: (value: number | null) => void;
  private onTouched!: () => void;

  vm$ = combineLatest({
    value: this.value$.data$,
    isDecrementDisabled: this.value$.data$.pipe(map(this.isDecrementDisabled.bind(this))),
    isIncrementDisabled: this.value$.data$.pipe(map(this.isIncrementDisabled.bind(this))),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['value'])) {
      this.value$.next(this.value ?? null);
    }
  }

  ngOnDestroy() {
    this.once.trigger();
  }

  onDecrement() {
    this.updateAndOutputValue(value => value - 1);
  }

  onIncrement() {
    this.updateAndOutputValue(value => value + 1);
  }

  // ControlValueAccessor
  writeValue(value: number | null) {
    this.value$.next(value ?? 1);
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

  private isDecrementDisabled(value: number): boolean {
    if (this.min === undefined) return false;
    return value <= this.min;
  }

  private isIncrementDisabled(value: number): boolean {
    if (this.max === undefined) return false;
    return value >= this.max;
  }

  private updateAndOutputValue(fn: (value: number) => number) {
    this.value$.next(value => {
      const newValue = fn(value);
      this.changed.emit(value);
      if (this.onChange) this.onChange(value);
      if (this.onTouched) this.onTouched();
      return newValue;
    });
  }
}
