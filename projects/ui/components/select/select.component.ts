import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  Provider,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
  runInInjectionContext,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormOption } from '@common/types';
import { cssClassesList, uniqueId } from '@common/utils';
import { TranslocoModule } from '@jsverse/transloco';

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
  host: {
    '[class]': 'cssClasses()',
    '[style.--_width]': 'styleWidth()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  selectedValue = linkedSignal(() => this.value() ?? null);
  isDisabled = linkedSignal(() => this._isDisabled());
  id = computed(() => uniqueId(this._id(), 'app-select'));
  styleWidth = computed(() => this.width() ?? 'fit-content');
  cssClasses = computed(() => cssClassesList([
    'app-select',
    this.isDisabled() ? '-disabled' : null,
    this.status() ? `-status-${this.status()}` : null,
    this.width() !== undefined ? '-with-custom-width' : null,
  ]));

  private selectRef =
    viewChild.required<ElementRef<HTMLSelectElement>>('selectRef');
  private onChange!: (val: any) => {};
  private onTouched!: () => {};

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
