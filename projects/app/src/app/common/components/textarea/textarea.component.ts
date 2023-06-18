import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, Provider, SimpleChanges, ViewChild, ViewEncapsulation, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { FormFieldStatus } from '@app/common/types';
import { HTMLAttributes, createAttributesController } from '@app/common/controllers';
import { cssClassesList, didInputChange, uniqueId } from '@app/common/utils';
import { ButtonComponent } from '../button';

const TEXTAREA_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => TextareaComponent),
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
  selector: 'app-textarea',
  exportAs: 'app-textarea',
  standalone: true,
  imports,
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TEXTAREA_FORM_PROVIDER],
  host: { class: 'app-textarea' },
})
export class TextareaComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() id?: string;
  @Input() value?: string;
  @Input() status?: FormFieldStatus;
  @Input() rows = 7;
  @Input() @HostBinding('class.-clearable') clearable = false;
  @Input() placeholder = '';
  @Input() withCharsCounter = false;
  @Input() maxChars = 500;
  @Input() withStatusIcon = true;
  @Input() withErrorId: string | null = null;
  @Input() @HostBinding('class.-full-width') withFullWidth = true;
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() attrs: HTMLAttributes | null = null;

  @Output() changed = new EventEmitter<string>();
  @Output() inputChanged = new EventEmitter<string>();

  @ViewChild('textareaRef', { static: true })
  private textareRef!: ElementRef<HTMLTextAreaElement>;

  @HostBinding('class') cssClass = '';

  inputValue = signal('');
  charsCounter = computed(() => this.inputValue().length);
  attrsController = createAttributesController();

  private onChange!: (val: any) => {};
	private onTouched!: () => {};

  ngOnInit() {
    this.id = uniqueId(this.id, 'app-textarea');
    this.attrsController.apply(this.textareRef.nativeElement, this.attrs);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (didInputChange(changes['value']) && this.value !== undefined) {
      this.inputValue.set(this.value);
      this.textareRef.nativeElement.value = this.value;
    }

    if (didInputChange(changes['width']) || didInputChange(changes['status'])) {
      this.updateCssClasses();
    }
  }

  // @publicApi
  setValue(val: string | null, triggerEvents = false): void {
    const value = val === null ? '' : val;
    this.textareRef.nativeElement.value = value;
    this.inputValue.set(value);

    if (triggerEvents) {
      if (this.onChange) this.onChange(value);
      if (this.onTouched) this.onTouched();
    }
  }

  // @publicApi
  clear(triggerEvents = false): void {
    const value = '' ;
    this.textareRef.nativeElement.value = value;
    this.inputValue.set(value);

    if (triggerEvents) {
      if (this.onChange) this.onChange('');
    }
  }

  // @publicApi
  getNativeElement(): HTMLTextAreaElement {
    return this.textareRef.nativeElement;
  }

  onClearInput(): void {
    this.clear();
    this.textareRef.nativeElement.focus();
    if (this.onChange) this.onChange(this.textareRef.nativeElement.value);
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
    this.changed.emit(value);
    if (this.onTouched) this.onTouched();
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
    this.inputChanged.emit(value);
    if (this.onChange) this.onChange(value);
    if (this.onTouched) this.onTouched();
  }

  onBlur() {
    if (this.onTouched) this.onTouched();
  }

  // From ControlValueAccessor
	writeValue(val: any): void {
    const value = val ?? '';
    this.textareRef.nativeElement.value = value;
    this.inputValue.set(value);
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

  private updateCssClasses(): void {
    this.cssClass = cssClassesList([
      !!this.status ? `-status-${this.status}` : null,
    ]);
  }
}
