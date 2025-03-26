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
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { matCheck, matClear } from '@ng-icons/material-icons/baseline';

import { FormFieldStatus } from '@app/common/types';
import {
  ElementAttributes,
  cssClassesList,
  uniqueId,
  useHtmlAttributes,
} from '@app/common/utils';
import { IconButtonComponent } from '../icon-button';
import { TextInputType } from './types';

const TEXT_INPUT_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextInputComponent),
  multi: true,
};

@Component({
  selector: 'app-text-input',
  exportAs: 'app-text-input',
  imports: [NgIcon, IconButtonComponent],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
  host: { class: 'app-text-input' },
  encapsulation: ViewEncapsulation.None,
  providers: [TEXT_INPUT_FORM_PROVIDER],
})
export class TextInputComponent implements ControlValueAccessor {
  _id = input<string>('', { alias: 'id' });
  type = input<TextInputType>('text');
  value = input<string>();
  status = input<FormFieldStatus>();
  clearable = input(false, { transform: booleanAttribute });
  clearLabel = input('Clear content');
  placeholder = input('');
  autocomplete = input<string>();
  withStatusIcon = input(true, { transform: booleanAttribute });
  withErrorId = input<string | null>(null);
  withFullWidth = input(false, { transform: booleanAttribute });
  _isDisabled = input(false, {
    alias: 'isDisabled',
    transform: booleanAttribute,
  });
  width = input<string>();
  attrs = input<ElementAttributes | null>(null);

  changed = output<string>();
  inputChanged = output<string>();
  cleared = output<void>();

  matCheck = matCheck;
  matClear = matClear;

  private inputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputRef');

  @HostBinding('class')
  get getCssClass() {
    return this.cssClass();
  }

  @HostBinding('style.--_width')
  get getStyleWidth() {
    return this.cssWidth();
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

  id = computed(() => uniqueId(this._id(), 'app-text-input'));
  isDisabled = signal(false);
  nativeInput = computed(() => this.inputRef().nativeElement);
  cssClass = computed(() =>
    cssClassesList([
      this.status() ? `-status-${this.status()}` : null,
      this.width() ? '-with-custom-width' : null,
    ])
  );
  cssWidth = computed(() => this.width() ?? 'fit-content');

  disabledEffect = effect(() => this.isDisabled.set(this._isDisabled()));

  attributesEffect = effect(() => {
    this.htmlAttrs.apply(this.inputRef().nativeElement, this.attrs());
  });

  valueEffect = effect(() => {
    const value = this.value();
    if (value === undefined) {
      return;
    }
    this.nativeInput().value = value;
  });

  private onChange!: (val: any) => {};
  private onTouched!: () => {};
  private htmlAttrs = useHtmlAttributes();

  // @publicApi
  focus(): void {
    this.nativeInput().focus();
  }

  // @publicApi
  setValue(value: string | null, triggerEvents = false): void {
    this.nativeInput().value = value === null ? '' : value;

    if (triggerEvents) {
      if (this.onChange) this.onChange(value);
      if (this.onTouched) this.onTouched();
    }
  }

  // @publicApi
  clear(triggerEvents = false): void {
    this.nativeInput().value = '';

    if (triggerEvents) {
      if (this.onChange) this.onChange('');
    }
  }

  // @publicApi
  getNativeElement(): HTMLInputElement {
    return this.nativeInput();
  }

  onClearInput(): void {
    this.clear();
    this.nativeInput().focus();
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
    this.inputRef().nativeElement.value = value ?? '';
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
