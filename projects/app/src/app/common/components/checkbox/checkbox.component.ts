import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, HostBinding, Provider, forwardRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { didInputChange, getRandomHash } from '@app/common/utils';

type CheckboxColor = 'primary' | 'secondary' | 'tertiary' | 'black';

const CHECKBOX_FORM_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => CheckboxComponent),
	multi: true,
};

const IMPORTS = [
  CommonModule,
];

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CHECKBOX_FORM_PROVIDER],
  host: { class: 'app-checkbox' },
})
export class CheckboxComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input('id') _id?: string;
  @Input('checked') _checked = false;
  @Input() @HostBinding('class.-disabled') isDisabled = false;
  @Input() @HostBinding('style.--app-checkbox-size') size = '20px';
  @Input() color: CheckboxColor = 'primary';

  @Output() changed = new EventEmitter<boolean | null>();

  @ViewChild('inputRef', { static: true }) inputRef!: ElementRef<HTMLInputElement>;

  @HostBinding('class.-checked') checked = false;
  @HostBinding('class') cssClass?: string;

  id!: string;

  private onChange!: (val: any) => void;
	private onTouched!: () => void;

  ngOnInit() {
    let id = this._id;
    if (!id) id = `app-checkbox-${getRandomHash(3)}`;
    this.id = id;

    this.cssClass = `-color-${this.color}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['_checked'])) {
      this.inputRef.nativeElement.checked = this._checked;
      this.checked = this._checked;
    }
  }

  onCheckboxChange(event: Event) {
    event.stopImmediatePropagation();
    this.checked = this.inputRef.nativeElement.checked;
    this.changed.emit(this.checked);
    if (this?.onChange) this.onChange(this.checked);
    if (this?.onTouched) this.onTouched();
  }

  // From ControlValueAccessor
	writeValue(value: boolean): void {
    this.inputRef.nativeElement.checked = value;
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
}
