import {
  Component,
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
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { EnumLike } from '@common/types';
import { cssClassesList, uniqueId } from '@common/utils';

export const TOGGLE_LABEL_POSITION = {
  LEFT: 'left',
  LEFT_FULLWIDTH: 'left-fullwidth',
  RIGHT: 'right',
  RIGHT_FULLWIDTH: 'right-fullwidth',
} as const;

export type ToggleLabelPosition = EnumLike<typeof TOGGLE_LABEL_POSITION>;

export type ToggleColor = 'primary' | 'secondary' | 'tertiary';

const TOGGLE_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleComponent),
  multi: true,
};

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.css',
  host: {
    '[class]': 'cssClasses()',
    '[class.-checked]': 'isChecked()',
    '[class.-disabled]': 'isDisabled()',
    '[style.--_bullet-size]': 'size()',
    '[attr.aria-errormessage]': 'withErrorId()',
  },
  encapsulation: ViewEncapsulation.None,
  providers: [TOGGLE_FORM_PROVIDER],
})
export class ToggleComponent implements ControlValueAccessor {
  private injector = inject(Injector);

  _id = input('', { alias: 'id' });
  title = input<string>();
  color = input<ToggleColor>('primary');
  _isChecked = input(false, {
    alias: 'isChecked',
    transform: booleanAttribute,
  });
  _isDisabled = input(false, {
    alias: 'isDisabled',
    transform: booleanAttribute,
  });
  size = input('24px');
  withLabel = input<ToggleLabelPosition>(TOGGLE_LABEL_POSITION.RIGHT);
  withErrorId = input<string | null>(null);

  changed = output<boolean>();
  LABEL = TOGGLE_LABEL_POSITION;
  isChecked = signal(false);
  isDisabled = signal(false);
  toggleValue = signal(false);
  id = computed(() => uniqueId(this._id(), 'app-toggle'));
  idLabel = computed(() => `${this.id()}-label`);
  cssClasses = computed(() => cssClassesList([
    'app-toggle',
    `-with-label-${this.withLabel()}`,
    `-color-${this.color()}`,
  ]));

  checkedEffect = effect(() => this.isChecked.set(this._isChecked()));
  disabledEffect = effect(() => this.isDisabled.set(this._isDisabled()));

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
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        this.isChecked.set(!!value);
      });
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
