import {
  Component,
  ElementRef,
  HostBinding,
  Provider,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import {
  HTMLAttributes,
  createAttributesController,
} from '@app/common/controllers';
import { FormFieldStatus } from '@app/common/types';
import { cssClassesList, uniqueId } from '@app/common/utils';
import { ButtonComponent } from '../button';

const TEXTAREA_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaComponent),
  multi: true,
};

@Component({
  selector: 'app-textarea',
  exportAs: 'app-textarea',
  imports: [MatIconModule, ButtonComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  host: { class: 'app-textarea' },
  encapsulation: ViewEncapsulation.None,
  providers: [TEXTAREA_FORM_PROVIDER],
})
export class TextareaComponent implements ControlValueAccessor {
  _id = input<string>('', { alias: 'id' });
  value = input<string>();
  status = input<FormFieldStatus>();
  withStatusIcon = input(true);
  rows = input(7);
  clearable = input(false);
  placeholder = input('');
  maxChars = input(500);
  withCharsCounter = input(false);
  withErrorId = input<string | null>(null);
  withFullWidth = input(true);
  _isDisabled = input(false, { alias: 'isDisabled' });
  attrs = input<HTMLAttributes | null>(null);

  changed = output<string>();
  inputChanged = output<string>();

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
    return this.withFullWidth();
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
  attrsController = createAttributesController();
  cssClass = computed(() =>
    cssClassesList([this.status() ? `-status-${this.status()}` : null])
  );

  disabledEffect = effect(() => this.isDisabled.set(this._isDisabled()), {
    allowSignalWrites: true,
  });

  attributesEffect = effect(() => {
    this.attrsController.apply(this.nativeInput(), this.attrs());
  });

  valueEffect = effect(
    () => {
      const value = this.value();
      if (value === undefined) {
        return;
      }
      this.inputValue.set(value);
      this.nativeInput().value = value;
    },
    { allowSignalWrites: true }
  );

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
