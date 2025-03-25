import {
  Component,
  HostBinding,
  Provider,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { cssClassesList, uniqueId } from '@app/common/utils';
import {
  TOGGLE_LABEL_POSITION,
  ToggleColor,
  ToggleLabelPosition,
} from './types';

const TOGGLE_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleComponent),
  multi: true,
};

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  host: { class: 'app-toggle' },
  encapsulation: ViewEncapsulation.None,
  providers: [TOGGLE_FORM_PROVIDER],
})
export class ToggleComponent implements ControlValueAccessor {
  _id = input('', { alias: 'id' });
  title = input<string>();
  color = input<ToggleColor>('primary');
  _isChecked = input(false, { alias: 'isChecked' });
  _isDisabled = input(false, { alias: 'isDisabled' });
  size = input('24px');
  withLabel = input<ToggleLabelPosition>(TOGGLE_LABEL_POSITION.RIGHT);
  withErrorId = input<string | null>(null);

  changed = output<boolean>();

  @HostBinding('class')
  get getCssClass() {
    return this.cssClass();
  }

  @HostBinding('class.-checked')
  get cssClassChecked() {
    return this.isChecked();
  }

  @HostBinding('class.-disabled')
  get cssClassDisabled() {
    return this.isDisabled();
  }

  @HostBinding('style.--_bullet-size')
  get styleBulletSize() {
    return this.size();
  }

  @HostBinding('attr.aria-errormessage')
  get attrAriaErrorMessage() {
    return this.withErrorId();
  }

  LABEL = TOGGLE_LABEL_POSITION;
  isChecked = signal(false);
  isDisabled = signal(false);
  toggleValue = signal(false);
  id = computed(() => uniqueId(this._id(), 'app-toggle'));
  idLabel = computed(() => `${this.id()}-label`);
  cssClass = computed(() =>
    cssClassesList([
      `-with-label-${this.withLabel()}`,
      `-color-${this.color()}`,
    ])
  );

  checkedEffect = effect(() => this.isChecked.set(this._isChecked()), {
    allowSignalWrites: true,
  });

  disabledEffect = effect(() => this.isDisabled.set(this._isDisabled()), {
    allowSignalWrites: true,
  });

  private onChange!: (val: any) => {};
  private onTouched!: () => {};

  onToggle() {
    if (this.isDisabled()) {
      return;
    }
    this.outputValue(!this.isChecked());
  }

  private outputValue(checked: boolean): void {
    this.isChecked.set(checked);
    this.changed.emit(checked);

    if (this.onChange) {
      this.onChange(checked);
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }

  // From ControlValueAccessor
  writeValue(value: any): void {
    this.isChecked.set(!!value);
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
