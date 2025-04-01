import {
  Component,
  ElementRef,
  HostBinding,
  Provider,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  input,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { matCheck, matClear } from '@ng-icons/material-icons/baseline';
import { FormFieldStatus } from '@common/types';
import { cssClassesList, uniqueId } from '@common/utils';
import { IconButtonComponent } from '@ui/components/icon-button';
import { HTMLAttributes } from '@common/controllers';
import { HTMLAttributesController } from '@fixcommon/controllers';

const TEXTAREA_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaComponent),
  multi: true,
};

@Component({
  selector: 'app-textarea',
  exportAs: 'app-textarea',
  imports: [NgIcon, IconButtonComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
  host: { class: 'app-textarea' },
  encapsulation: ViewEncapsulation.None,
  providers: [TEXTAREA_FORM_PROVIDER],
})
export class TextareaComponent implements ControlValueAccessor {
  _id = input<string>('', { alias: 'id' });
  value = input<string>();
  status = input<FormFieldStatus>();
  withStatusIcon = input(true, { transform: booleanAttribute });
  rows = input(7, { transform: numberAttribute });
  clearable = input(false, { transform: booleanAttribute });
  clearLabel = input('Clear content');
  placeholder = input('');
  maxChars = input(500, { transform: numberAttribute });
  withCharsCounter = input(false, { transform: booleanAttribute });
  withErrorId = input<string | null>(null);
  fullWidth = input(true, { transform: booleanAttribute });
  _isDisabled = input(false, {
    alias: 'isDisabled',
    transform: booleanAttribute,
  });
  attrs = input<HTMLAttributes | null>(null);

  changed = output<string>();
  inputChanged = output<string>();

  matCheck = matCheck;
  matClear = matClear;

  @HostBinding('class')
  get getCssClass() {
    return this.cssClass();
  }

  @HostBinding('class.-clearable')
  get cssClassClearable() {
    return this.clearable();
  }

  @HostBinding('class.-full-width')
  get cssClassFullWidth() {
    return this.fullWidth();
  }

  @HostBinding('class.-disabled')
  get cssClassDisabled() {
    return this.isDisabled();
  }

  private textareaRef =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('textareaRef');

  id = computed(() => uniqueId(this._id(), 'app-textarea'));
  isDisabled = signal(false);
  inputValue = signal('');
  charsCounter = computed(() => this.inputValue().length);
  nativeInput = computed(() => this.textareaRef().nativeElement);
  attrsController = new HTMLAttributesController();
  cssClass = computed(() =>
    cssClassesList([this.status() ? `-status-${this.status()}` : null])
  );

  disabledEffect = effect(() => this.isDisabled.set(this._isDisabled()));

  attributesEffect = effect(() => {
    this.attrsController.apply(this.nativeInput(), this.attrs());
  });

  valueEffect = effect(() => {
    const value = this.value();
    if (value === undefined) {
      return;
    }
    this.inputValue.set(value);
    this.nativeInput().value = value;
  });

  private onChange!: (val: any) => {};
  private onTouched!: () => {};

  // @publicApi
  setValue(val: string | null, triggerEvents = false): void {
    const value = val === null ? '' : val;
    this.nativeInput().value = value;
    this.inputValue.set(value);

    if (triggerEvents) {
      if (this.onChange) this.onChange(value);
      if (this.onTouched) this.onTouched();
    }
  }

  // @publicApi
  clear(triggerEvents = false): void {
    const value = '';
    this.nativeInput().value = value;
    this.inputValue.set(value);

    if (triggerEvents) {
      if (this.onChange) this.onChange('');
    }
  }

  // @publicApi
  getNativeElement(): HTMLTextAreaElement {
    return this.nativeInput();
  }

  onClearInput(): void {
    this.clear();
    this.nativeInput().focus();
    if (this.onChange) this.onChange(this.nativeInput().value);
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
    this.nativeInput().value = value;
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
    this.isDisabled.set(isDisabled);
  }
}
