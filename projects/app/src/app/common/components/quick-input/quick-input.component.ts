import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, of } from 'rxjs';

import { DataSource, EventSource, OnceSource } from '@app/common/sources';
import { didInputChange } from '@app/common/utils';
import { ButtonComponent } from '../button';
import { QUICK_INPUT_MODE, QuickInputMode } from './types';

const IMPORTS = [
  NgIf,
  NgFor,
  AsyncPipe,
  NgTemplateOutlet,
  NgSwitch,
  NgSwitchCase,
  MatIconModule,
  ButtonComponent,
];

@Component({
  selector: 'app-quick-input',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quick-input.component.html',
  styleUrls: ['./quick-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-quick-input' },
})
export class QuickInputComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  
  @Input() value?: number;
  @Input() values: number[] = [1, 2, 3];
  @Input() isDisabled = false;

  @Output() changed = new EventEmitter<number>();

  private once = new OnceSource();
  private value$ = new DataSource<number | null>(null, this.once.event$);
  private mode$ = new DataSource<QuickInputMode>(QUICK_INPUT_MODE.CHOICES, this.once.event$);
  private changed$ = new EventSource<number>();
  private onChange!: (value: number | null) => void;
  private onTouched!: () => void;

  QUICK_INPUT_MODE = QUICK_INPUT_MODE;
  vm$ = combineLatest({
    value: this.value$.data$,
    values: of(this.values),
    mode: this.mode$.data$,
  });

  ngOnInit() {
    this.changed$.event$.subscribe(value => {
      this.changed.emit(value);
      if (this.onChange) {
        this.onChange(value);
      }
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

  onSwitchToEdit() {
    this.mode$.next(QUICK_INPUT_MODE.EDITING);
  }

  onSwitchToChoices() {
    this.mode$.next(QUICK_INPUT_MODE.CHOICES);
  }

  onSelectValue(value: number) {
    console.log('onSelectValue', value);
    this.value$.next(value);
  }

  // ControlValueAccessor
  writeValue(value: number | null) {
    this.value$.next(value);
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
