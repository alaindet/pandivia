import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, of } from 'rxjs';

import { DataSource, EventSource, OnceSource } from '@app/common/sources';
import { didInputChange } from '@app/common/utils';
import { ButtonComponent } from '../button';

const IMPORTS = [
  NgIf,
  AsyncPipe,
  MatIconModule,
  ButtonComponent,
];

@Component({
  selector: 'app-quick-number',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quick-number.component.html',
  styleUrls: ['./quick-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-quick-number' },
})
export class QuickNumberComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  
  @Input() value = 1;
  @Input() min?: number;
  @Input() max?: number;
  @Input() isDisabled = false;

  @Output() changed = new EventEmitter<number>();

  private once = new OnceSource();
  private value$ = new DataSource<number>(this.value, this.once.event$);
  private changed$ = new EventSource<number>();
  private onChange!: (value: number | null) => void;
  private onTouched!: () => void;

  vm$ = combineLatest({
    value: this.value$.data$,
    isDecrementDisabled: of(false), // TODO
    isIncrementDisabled: of(false), // TODO
  });

  ngOnInit() {
    this.changed$.event$.subscribe(value => {
      this.changed.emit(value);
      if (this.onChange) this.onChange(value);
      if (this.onTouched) this.onTouched();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['value'])) {
      this.value$.next(this.value ?? null);
    }
  }

  ngOnDestroy() {
    this.once.trigger();
  }

  onDecrement() {
    this.value$.next(value => value - 1);
  }

  onIncrement() {
    this.value$.next(value => value + 1);
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
}
