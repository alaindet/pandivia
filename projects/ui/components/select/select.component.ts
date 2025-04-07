import {
  Component,
  ElementRef,
  HostBinding,
  Injector,
  Provider,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { FormOption } from '@common/types';
import { cssClassesList, uniqueId } from '@common/utils';

import { FormFieldStatus } from '../form-field';

const SELECT_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true,
};

@Component({
  selector: 'app-select',
  imports: [TranslocoModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  host: { class: 'app-select' },
  encapsulation: ViewEncapsulation.None,
  providers: [SELECT_FORM_PROVIDER],
})
export class SelectComponent implements ControlValueAccessor {
  private injector = inject(Injector);

  _id = input<string>('', { alias: 'id' });
  value = input<string>();
  status = input<FormFieldStatus>();
  _isDisabled = input(false, {
    alias: 'isDisabled',
    transform: booleanAttribute,
  });
  options = input<FormOption[]>([]);
  width = input<string>();
  withDefaultOption = input(true, { transform: booleanAttribute });
  i18nDefaultOption = input('Select...');

  selected = output<string | null>();

  @HostBinding('class.-disabled')
  get cssClassDisabled() {
    return this.isDisabled();
  }

  @HostBinding('style.--_width')
  get getStyleWidth() {
    return this.styleWidth();
  }

  @HostBinding('class')
  get getCssClass() {
    return this.cssClass();
  }

  @HostBinding('class.-with-custom-width')
  get getCssClassWithCustomWidth() {
    return this.width() !== undefined;
  }

  selectedValue = signal<string | null>(null);
  isDisabled = signal(false);
  id = computed(() => uniqueId(this._id(), 'app-select'));
  styleWidth = computed(() => this.width() ?? 'fit-content');
  cssClass = computed(() =>
    cssClassesList([this.status() ? `-status-${this.status()}` : null])
  );

  private selectRef =
    viewChild.required<ElementRef<HTMLSelectElement>>('selectRef');
  private onChange!: (val: any) => {};
  private onTouched!: () => {};

  valueEffect = effect(() => this.selectedValue.set(this.value() ?? null));
  disabledEffect = effect(() => this.isDisabled.set(this._isDisabled()));

  // Thanks to https://linuxhint.com/select-onchange-javascript/
  onSelectChange() {
    let index = this.selectRef().nativeElement.selectedIndex;

    if (this.withDefaultOption() && index === 0) {
      this.outputValue(null);
      return;
    }

    if (this.withDefaultOption()) {
      index -= 1;
    }

    const option = this.options()[index];
    this.outputValue(option.value);
  }

  private outputValue(value: string | null): void {
    this.selectedValue.set(value);
    this.selected.emit(value);
    if (this.onChange) this.onChange(value);
    if (this.onTouched) this.onTouched();
  }

  // From ControlValueAccessor
  writeValue(value: string | null): void {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => this.selectedValue.set(value));
    });
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
