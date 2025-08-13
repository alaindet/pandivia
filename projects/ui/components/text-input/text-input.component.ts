import {
  Component,
  ElementRef,
  Provider,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { matCheck, matClear } from '@ng-icons/material-icons/baseline';
import { FormFieldStatus } from '../form-field';
import { cssClassesList, uniqueId, HTMLAttributes } from '@common/utils';

import { IconButtonComponent } from '../icon-button';

export type TextInputType = 'text' | 'email' | 'number' | 'password' | 'search';

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
  host: {
    '[class]': 'cssClasses()',
    '[class.-clearable]': 'clearable()',
    '[class.-full-width]': 'fullWidth()',
    '[class.-disabled]': 'isDisabled()',
    '[style.--_width]': 'cssWidth()',
  },
  encapsulation: ViewEncapsulation.None,
  providers: [TEXT_INPUT_FORM_PROVIDER],
})
export class TextInputComponent implements ControlValueAccessor {
  _id = input<string>('', { alias: 'id' });
  type = input<TextInputType>('text');
  value = input<string>();
  status = input<FormFieldStatus>();
  clearable = input(false, { transform: booleanAttribute });
  placeholder = input('');
  autocomplete = input<string>();
  withStatusIcon = input(true, { transform: booleanAttribute });
  withErrorId = input<string | null>(null);
  fullWidth = input(false, { transform: booleanAttribute });
  _isDisabled = input(false, {
    alias: 'isDisabled',
    transform: booleanAttribute,
  });
  width = input<string>();
  attrs = input<Record<string, string | number | boolean> | null>(null);
  i18nClearContent = input('Clear content');

  changed = output<string>();
  inputChanged = output<string>();
  cleared = output<void>();

  icon = { matCheck, matClear };

  private inputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputRef');

  id = computed(() => uniqueId(this._id(), 'app-text-input'));
  isDisabled = linkedSignal(() => this._isDisabled());
  nativeInput = computed(() => this.inputRef().nativeElement);
  cssClasses = computed(() => cssClassesList([
    'app-text-input',
    this.status() ? `-status-${this.status()}` : null,
    this.width() ? '-with-custom-width' : null,
  ]));
  cssWidth = computed(() => this.width() ?? 'fit-content');

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
  private htmlAttrs = new HTMLAttributes();

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
