import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, Provider, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { didInputChange, getRandomHash } from '@app/common/utils';
import { ButtonComponent } from '../button';

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
  NgSwitchCase,
  MatIconModule,
  ButtonComponent,
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

  @Input() id?: string;
  @Input() type: TextInputType = 'text';
  @Input() value?: string;
  @Input() status?: TextInputStatus;
  @Input() @HostBinding('class.-clearable') clearable = false;
  @Input() placeholder = '';
  @Input() withStatusIcon = true;
  @Input() @HostBinding('class.-full-width') withFullWidth = false;
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() width?: string;
  @Input() attrs: { [attrName: string]: string | number | boolean} | null = null;

  @Output() changed = new EventEmitter<string>();
  @Output() inputChanged = new EventEmitter<string>();

  @ViewChild('inputRef', { static: true })
  private inputRef!: ElementRef<HTMLInputElement>;

  @HostBinding('class') cssClass = '';
  @HostBinding('style.--app-text-input-width') cssWidth = '';

  private onChange!: (val: any) => {};
	private onTouched!: () => {};

  ngOnInit() {

    if (!this.id) {
      this.id = `app-text-input-${getRandomHash(3)}`;
    }

    if (this.attrs) {
      const el = this.inputRef.nativeElement;
      for (const [key, value] of Object.entries(this.attrs)) {

        switch (value) {
          case true:
            this.renderer.setAttribute(el, key, '');
            break;
          case false:
            // Do nothing
            break;
          default:
            this.renderer.setAttribute(el, key, String(value));
            break;
        }
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
    if (this.onChange) this.onChange(this.inputRef.nativeElement.value);
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
