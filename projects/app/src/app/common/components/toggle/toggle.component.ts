import { Component, EventEmitter, HostBinding, Input, OnInit, Output, Provider, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIf, NgTemplateOutlet } from '@angular/common';

import { getRandomHash } from '@app/common/utils';
import { TOGGLE_LABEL_POSITION, ToggleLabelPosition } from './types';

const IMPORTS = [
  NgIf,
  NgTemplateOutlet,
];

const TOGGLE_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleComponent),
  multi: true,
};

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [TOGGLE_FORM_PROVIDER],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle' },
})
export class ToggleComponent implements OnInit, ControlValueAccessor {

  @Input() id!: string;
  @Input() title?: string;
  @Input() @HostBinding('class.-checked') checked = false;
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() @HostBinding('style.--app-toggle-bullet-size') size = '24px';
  @Input() withLabel: ToggleLabelPosition = TOGGLE_LABEL_POSITION.RIGHT;

  @Output() changed = new EventEmitter<boolean>();

  @HostBinding('class') cssClasses!: string;

  LABEL = TOGGLE_LABEL_POSITION;

  private onChange!: (val: any) => {};
  private onTouched!: () => {};

  ngOnInit() {
    if (!this.id) {
      this.id = `app-toggle-${getRandomHash(3)}`;
    }

    this.cssClasses = `-with-label-${this.withLabel}`;
  }

  // From ControlValueAccessor
  writeValue(value: any): void {
    // ...
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
}
