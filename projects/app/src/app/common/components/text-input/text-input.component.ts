import { NgIf, NgSwitch } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, Provider, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { didInputChange } from '@app/common/utils';

type TextInputType = 'text' | 'email' | 'number' | 'password' | 'search';
type TextInputStatus = 'success' | 'error';

const TEXT_INPUT_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => TextInputComponent),
	multi: true,
};

const IMPORTS = [
  NgIf,
  NgSwitch,
  MatIconModule,
];

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: IMPORTS,
  exportAs: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TEXT_INPUT_FORM_PROVIDER],
  host: { class: 'app-text-input' },
})
export class TextInputComponent implements OnInit, OnChanges, ControlValueAccessor {

  private renderer = inject(Renderer2);

  @Input() type: TextInputType = 'text';
  @Input() id?: string;
  @Input() value?: string;
  @Input() status?: TextInputStatus;
  @Input() clearable = false;
  @Input() placeholder = '';
  @Input() withStatusIcon = true;
  @Input() @HostBinding('class.-full-width') withFullWidth = false;
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() width?: string;
  @Input() attrs: { [attrName: string]: string | number } | null = null;

  @Output() changed = new EventEmitter<string>();

  @ViewChild('inputRef', { static: true })
  private inputRef!: ElementRef<HTMLInputElement>;

  @HostBinding('class') cssClass = '';
  @HostBinding('style.--width') cssWidth = '';

  showPassword = false;

  private onChange!: (val: any) => {};
	private onTouched!: () => {};

  ngOnInit() {
    if (this.attrs) {
      const el = this.inputRef.nativeElement;
      for (const [key, value] of Object.entries(this.attrs)) {
        this.renderer.setAttribute(el, key, String(value));
      }
    }
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
  setValue(value: string | null, triggerEvents = false): void {
    this.inputRef.nativeElement.value = value === null ? '' : value;

    if (triggerEvents) {
      if (this.onChange) this.onChange(value);
      if (this.onTouched) this.onTouched();
    }
  }

  // @publicApi
  clear(triggerEvents = false): void {
    this.showPassword = false;
    this.inputRef.nativeElement.value = '';
    this.status = undefined;
    this.cssClass = '';

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
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.changed.emit(value);
    if (this.onTouched) this.onTouched();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.onChange) this.onChange(value);
    if (this.onTouched) this.onTouched();
  }

  onBlur() {
    if (this.onTouched) this.onTouched();
  }

  onTogglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
      this.cssWidth = this.width;
    } else {
      this.cssWidth = '';
    }

    this.cssClass = cssClasses.length ? cssClasses.join(' ') : '';
  }
}
