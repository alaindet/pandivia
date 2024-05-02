import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, Provider, SimpleChanges, ViewEncapsulation, computed, effect, forwardRef, inject, input, output, signal } from '@angular/core';
import { filter, fromEvent, merge, takeUntil } from 'rxjs';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventSource, OnceSource } from '@app/common/sources';
import { KEYBOARD_KEY as KB } from '@app/common/types';
import { didInputChange, getRandomHash, uniqueId } from '@app/common/utils';
import { CheckboxColor } from './types';

const CHECKBOX_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => CheckboxComponent),
	multi: true,
};

/**
 * TODO: Make it accessible
 */
@Component({
  selector: 'app-checkbox',
  exportAs: 'app-checkbox',
  standalone: true,
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
export class CheckboxComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  private host = inject(ElementRef);

  private once = new OnceSource();
  private disableEvents$ = new EventSource<void>(this.once.event$);
  private onChange!: (val: any) => void;
	private onTouched!: () => void;

  _id = input('', { alias: 'id' });
  _isChecked = input(false, { alias: 'isChecked' });
  size = input('20px');
  _isDisabled = input(false, { alias: 'isDisabled' });
  color = input<CheckboxColor>('primary');
  isInteractable = input(true);
  ariaLabelledBy = input<string>();
  withErrorId = input<string | null>(null);

  changed = output<boolean>();

  // TODO
  @HostBinding('class')
  cssClasses = '-color-primary';

  // TODO
  @HostBinding('class.-interactable')
  cssIsInteractable = true;

  // TODO
  @HostBinding('tabindex')
  tabIndex = '0';

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

  id = computed(() => uniqueId(this._id(), 'app-select'));
  isDisabled = signal(false);
  isChecked = signal(false);

  onCheckedChange$ = effect(() => this.isChecked.set(this._isChecked()), {
    allowSignalWrites: true,
  });

  onDisabledChange$ = effect(() => this.isDisabled.set(this._isDisabled()), {
    allowSignalWrites: true,
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

  ngOnInit() {
    if (this.isInteractable()) {
      this.toggleInteractivity();
    }

    if (this.isDisabled()) {
      this.disableEvents$.next();
      this.tabIndex = '-1';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['isInteractable'])) {
      this.toggleInteractivity();
    }

    if (didInputChange(changes['color'])) {
      this.cssClasses = `-color-${this.color}`;
    }

    if (didInputChange(changes['isDisabled'])) {
      this.disableEvents$.next();
      this.tabIndex = '-1';
    }
  }

  // TODO
  private toggleInteractivity(): void {
    this.cssIsInteractable = this.isInteractable;
    this.tabIndex = this.isInteractable ? '0' : '-1';
    this.disableEvents$.next();

    if (!this.isInteractable || this.isDisabled) {
      return;
    }

    const el = this.host.nativeElement;
    const clicked$ = fromEvent<MouseEvent>(el, 'click');

    const spaceOrEnterPressed$ = fromEvent<KeyboardEvent>(el, 'keydown').pipe(
      filter(e => e.key === KB.SPACE || e.key === KB.ENTER),
    );

    const toggleCheckbox$ = merge(clicked$, spaceOrEnterPressed$).pipe(
      takeUntil(this.once.event$),
      takeUntil(this.disableEvents$.event$),
    );

    toggleCheckbox$.subscribe((event: Event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.toggle();
    });
  }

  ngOnDestroy() {
    this.once.trigger();
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
