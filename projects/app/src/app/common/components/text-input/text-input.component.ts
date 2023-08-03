import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, ElementRef, EnvironmentInjector, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, Provider, SimpleChanges, ViewChild, ViewEncapsulation, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { FormFieldStatus } from '@app/common/types';
import { ElementAttributes, useHtmlAttributes, didInputChange, uniqueId } from '@app/common/utils';
import { ButtonComponent } from '../button';

type TextInputType = 'text' | 'email' | 'number' | 'password' | 'search';

const TEXT_INPUT_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => TextInputComponent),
	multi: true,
};

const imports = [
  NgIf,
  NgSwitch,
  NgSwitchCase,
  MatIconModule,
  ButtonComponent,
];

@Component({
  selector: 'app-text-input',
  exportAs: 'app-text-input',
  standalone: true,
  imports,
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TEXT_INPUT_FORM_PROVIDER],
  host: { class: 'app-text-input' },
})
export class TextInputComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() id?: string;
  @Input() type: TextInputType = 'text';
  @Input() value?: string;
  @Input() status?: FormFieldStatus;
  @Input() @HostBinding('class.-clearable') clearable = false;
  @Input() placeholder = '';
  @Input() autocomplete?: string;
  @Input() withStatusIcon = true;
  @Input() withErrorId: string | null = null;
  @Input() @HostBinding('class.-full-width') withFullWidth = false;
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() width?: string;
  @Input() attrs: ElementAttributes | null = null;

  @Output() changed = new EventEmitter<string>();
  @Output() inputChanged = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  @ViewChild('inputRef', { static: true })
  private inputRef!: ElementRef<HTMLInputElement>;

  @HostBinding('class') cssClass = '';
  @HostBinding('style.--app-text-input-width') cssWidth = '';

  private onChange!: (val: any) => {};
	private onTouched!: () => {};
  private htmlAttrs = useHtmlAttributes();

  ngOnInit() {
    this.id = uniqueId(this.id, 'app-text-input');
    this.htmlAttrs.apply(this.inputRef.nativeElement, this.attrs);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (didInputChange(changes['value']) && this.value !== undefined) {
      this.inputRef.nativeElement.value = this.value;
    }

    if (didInputChange(changes['width']) || didInputChange(changes['status'])) {
      this.updateStyle();
    }
  }

  // @publicApi
  focus(): void {
    this.inputRef?.nativeElement?.focus();
  }

  // @publicApi
  setValue(value: string | null, triggerEvents = false): void {
    this.inputRef.nativeElement.value = value === null ? '' : value;

    if (triggerEvents) {
      if (this.onChange) this.onChange(value);
      if (this.onTouched) this.onTouched();
    }
  }

  // @publicApi
  clear(triggerEvents = false): void {
    this.inputRef.nativeElement.value = '';

    if (triggerEvents) {
      if (this.onChange) this.onChange('');
    }
  }

  // @publicApi
  getNativeElement(): HTMLInputElement {
    return this.inputRef.nativeElement;
  }

  onClearInput(): void {
    this.clear();
    this.inputRef.nativeElement.focus();
    if (this.onChange) this.onChange('');
    this.cleared.emit();
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.changed.emit(value);
    if (this.onTouched) this.onTouched();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputChanged.emit(value);
    if (this.onChange) this.onChange(value);
    if (this.onTouched) this.onTouched();
  }

  onBlur() {
    if (this.onTouched) this.onTouched();
  }

  // From ControlValueAccessor
	writeValue(value: any): void {
    this.inputRef.nativeElement.value = value ?? '';
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

  private updateStyle(): void {
    const cssClasses: string[] = [];

    if (this.status) {
      cssClasses.push(`-status-${this.status}`);
    }

    if (this.width) {
      cssClasses.push('-with-custom-width');
    }

    this.cssWidth = !!this.width ? this.width : 'fit-content';
    this.cssClass = cssClasses.length ? cssClasses.join(' ') : '';
  }
}
