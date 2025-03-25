import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Provider,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Subscription, filter, fromEvent, merge } from 'rxjs';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { KEYBOARD_KEY as KB } from '@app/common/types';
import { cssClassesList, uniqueId } from '@app/common/utils';
import { CheckboxColor } from './types';

const CHECKBOX_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: 'app-checkbox',
  exportAs: 'app-checkbox',
  template: `
    <span class="_checkmark"></span>
    <span class="_content"><ng-content></ng-content></span>
  `,
  styleUrl: './checkbox.component.scss',
  host: {
    class: 'app-checkbox',
    role: 'checkbox',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CHECKBOX_FORM_PROVIDER],
})
export class CheckboxComponent implements ControlValueAccessor {
  private host = inject(ElementRef);

  _id = input('', { alias: 'id' });
  _isChecked = input(false, { alias: 'isChecked' });
  size = input('20px');
  _isDisabled = input(false, { alias: 'isDisabled' });
  color = input<CheckboxColor>('primary');
  isInteractable = input(true);
  ariaLabelledBy = input<string>();
  withErrorId = input<string | null>(null);

  changed = output<boolean>();

  @HostBinding('class')
  get getCssClass() {
    return this.cssClass();
  }

  @HostBinding('class.-interactable')
  get cssClassInteractable() {
    return this.isInteractable();
  }

  @HostBinding('tabindex')
  get getTabIndex() {
    return this.tabIndex();
  }

  @HostBinding('attr.id')
  get attrId() {
    return this.id();
  }

  @HostBinding('class.-checked')
  @HostBinding('attr.aria-checked')
  get getClassChecked() {
    return this.isChecked();
  }

  @HostBinding('style.--_size')
  get styleSize() {
    return this.size();
  }

  @HostBinding('class.-disabled')
  get cssClassDisabled() {
    return this.isDisabled();
  }

  @HostBinding('attr.aria-labelledby')
  get attrAriaLabelledBy() {
    return this.ariaLabelledBy();
  }

  @HostBinding('attr.aria-errormessage')
  get attrAriaErrorMessage() {
    return this.withErrorId();
  }

  private onChange!: (val: any) => void;
  private onTouched!: () => void;
  private interactiveSub: Subscription | null = null;

  id = computed(() => uniqueId(this._id(), 'app-select'));
  isDisabled = signal(false);
  isChecked = signal(false);
  tabIndex = computed(() => (this.isDisabled() ? '-1' : '0'));
  cssClass = computed(() => cssClassesList([`-color-${this.color()}`]));
  checkedEffect = effect(() => this.isChecked.set(this._isChecked()));
  disabledEffect = effect(() => this.isDisabled.set(this._isDisabled()));

  interactivityEffect = effect((onCleanup) => {
    if (!this.isInteractable() || this.isDisabled()) {
      return;
    }

    const el = this.host.nativeElement;

    const clicked$ = fromEvent<MouseEvent>(el, 'click');

    const spaceOrEnterPressed$ = fromEvent<KeyboardEvent>(el, 'keydown').pipe(
      filter((e) => e.key === KB.SPACE || e.key === KB.ENTER)
    );

    const toggledCheckbox$ = merge(clicked$, spaceOrEnterPressed$);

    this.interactiveSub = toggledCheckbox$.subscribe((event: Event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.toggle();
    });

    onCleanup(() => {
      this.interactiveSub?.unsubscribe();
    });
  });

  // @publicApi
  toggle() {
    const isChecked = this.isChecked();
    this.isChecked.set(!isChecked);
    this.changed.emit(!isChecked);

    if (this.onChange) {
      this.onChange(!isChecked);
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }

  // From ControlValueAccessor
  writeValue(value: boolean): void {
    this.isChecked.set(value);
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
