import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output, Provider, ViewEncapsulation, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { cssClassesList, getRandomHash } from '@app/common/utils';
import { TOGGLE_LABEL_POSITION, ToggleLabelPosition } from './types';

const imports = [
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
  imports,
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [TOGGLE_FORM_PROVIDER],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle' },
})
export class ToggleComponent implements OnInit, ControlValueAccessor {

  @Input() id!: string;
  @Input() title?: string;
  @Input() color: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() @HostBinding('class.-checked') checked = false;
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() @HostBinding('style.--app-toggle-bullet-size') size = '24px';
  @Input() withLabel: ToggleLabelPosition = TOGGLE_LABEL_POSITION.RIGHT;
  @Input() @HostBinding('attr.aria-errormessage') withErrorId: string | null = null;

  @Output() changed = new EventEmitter<boolean>();

  @HostBinding('class') cssClasses!: string;

  LABEL = TOGGLE_LABEL_POSITION;
  idLabel!: string;
  toggleValue = signal(false);

  private onChange!: (val: any) => {};
  private onTouched!: () => {};

  ngOnInit() {
    this.initIds();
    this.initCssClasses();
  }

  onToggle() {
    if (this.isDisabled) return;
    this.outputValue(!this.checked);
  }

  // From ControlValueAccessor
  writeValue(value: any): void {
    const checked = !!value;
    this.checked = checked;
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

  private initIds(): void {
    if (!this.id) {
      this.id = `app-toggle-${getRandomHash(3)}`;
    }
    this.idLabel = `${this.id}-label`;
  }

  private initCssClasses(): void {
    this.cssClasses = cssClassesList([
      `-with-label-${this.withLabel}`,
      `-color-${this.color}`,
    ]);
  }

  private outputValue(checked: boolean): void {
    this.checked = checked;
    this.changed.emit(checked);
    if (this.onChange) this.onChange(checked);
    if (this.onTouched) this.onTouched();
  }
}
