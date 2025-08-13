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
  effect,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
  runInInjectionContext
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { KEYBOARD_KEY as KB } from '@common/types';
import { cssClassesList, uniqueId } from '@common/utils';
import { Subscription, filter, fromEvent, merge } from 'rxjs';

export type CheckboxColor = 'primary' | 'secondary' | 'tertiary' | 'black';

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
    <span class="_content"><ng-content /></span>
  `,
  styleUrl: './checkbox.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CHECKBOX_FORM_PROVIDER],
  host: {
    '[class]': 'cssClass()',
    '[class.-interactable]': 'isInteractable()',
    '[tabindex]': 'tabIndex()',
    '[attr.id]': 'id()',
    '[class.-checked]': 'isChecked()',
    '[attr.aria-checked]': 'isChecked()',
    '[style.--_size]': 'size()',
    '[class.-disabled]': 'isDisabled()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aroa-errormessage]': 'withErrorId()',
    role: 'checkbox',
  },
})
export class CheckboxComponent implements ControlValueAccessor {
  private host = inject(ElementRef);
  private injector = inject(Injector);

  _id = input('', { alias: 'id' });
  _isChecked = input(false, {
    alias: 'isChecked',
    transform: booleanAttribute,
  });
  size = input('20px');
  _isDisabled = input(false, {
    alias: 'isDisabled',
    transform: booleanAttribute,
  });
  color = input<CheckboxColor>('primary');
  isInteractable = input(true, { transform: booleanAttribute });
  ariaLabelledBy = input<string>();
  withErrorId = input<string | null>(null);

  changed = output<boolean>();

  private onChange!: (val: any) => void;
  private onTouched!: () => void;
  private interactiveSub: Subscription | null = null;

  id = computed(() => uniqueId(this._id(), 'app-select'));
  isChecked = linkedSignal(() => this._isChecked());
  isDisabled = linkedSignal(() => this._isDisabled());
  tabIndex = computed(() => (this.isDisabled() ? '-1' : '0'));
  cssClass = computed(() => cssClassesList([
    'app-checkbox',
    `-color-${this.color()}`,
  ]));

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
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => this.isChecked.set(value));
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
