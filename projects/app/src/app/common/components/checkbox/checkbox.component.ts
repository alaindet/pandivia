import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, Provider, SimpleChanges, ViewEncapsulation, forwardRef, inject } from '@angular/core';
import { filter, fromEvent, merge, takeUntil } from 'rxjs';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventSource, OnceSource } from '@app/common/sources';
import { KEYBOARD_KEY as KB } from '@app/common/types';
import { didInputChange, getRandomHash } from '@app/common/utils';
import { CheckboxColor } from './types';

const CHECKBOX_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => CheckboxComponent),
	multi: true,
};

@Component({
  selector: 'app-checkbox',
  exportAs: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-checkbox',
    role: 'checkbox',
  },
  providers: [CHECKBOX_FORM_PROVIDER],
})
export class CheckboxComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  private host = inject(ElementRef);

  private once = new OnceSource();
  private disableEvents$ = new EventSource<void>(this.once.event$);
  private onChange!: (val: any) => void;
	private onTouched!: () => void;

  @Input() @HostBinding('attr.id') id?: string;
  @Input() @HostBinding('class.-checked') @HostBinding('attr.aria-checked') checked = false;
  @Input() @HostBinding('style.--app-checkbox-size') size = '20px';
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() color: CheckboxColor = 'primary';
  @Input() isInteractable = true;
  @Input() @HostBinding('attr.aria-labelledby') ariaLabelledBy?: string;

  @Output() changed = new EventEmitter<boolean>();

  @HostBinding('class') cssClasses = '-color-primary';
  @HostBinding('class.-interactable') cssIsInteractable = true;
  @HostBinding('tabindex') tabIndex = '0';

  // @publicApi
  toggle() {
    this.checked = !this.checked;
    this.changed.emit(this.checked);
    if (this.onChange) this.onChange(this.checked);
    if (this.onTouched) this.onTouched();
  }

  ngOnInit() {

    if (!this.id) {
      this.id = 'app-checkbox-' + getRandomHash(3);
    }

    if (this.isInteractable) {
      this.toggleInteractivity();
    }

    if (this.isDisabled) {
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

  ngOnDestroy() {
    this.once.trigger();
  }

  // From ControlValueAccessor
	writeValue(value: boolean): void {
    this.checked = value;
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
    this.isDisabled = isDisabled;
  }

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
}
