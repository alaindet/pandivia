import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TextInputComponent } from '@ui/components/text-input';

import { AutocompleteOptionComponent } from './autocomplete-option.component';
import { AutocompleteService } from './autocomplete.service';
import { createClickOutController } from './click-out.controller';
import {
  AUTOCOMPLETE_CURRENT_TEMPLATE,
  AUTOCOMPLETE_ITEMS_TEMPLATE,
  AUTOCOMPLETE_SOURCE_TYPE,
  AutocompleteAsyncOptionsFn,
  AutocompleteComponentLabels,
  AutocompleteCurrentTemplate,
  AutocompleteOption,
  AutocompleteOptionValuePicker,
  AutocompleteSourceType,
} from './types';

@Component({
  selector: 'app-autocomplete',
  imports: [NgTemplateOutlet, AutocompleteOptionComponent],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
  host: { class: 'app-autocomplete' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [AutocompleteService],
})
export class AutocompleteComponent implements OnInit {
  private svc = inject(AutocompleteService);
  private host = inject(ElementRef);

  // Input
  inputComponent = input.required<TextInputComponent>();
  sourceType = input.required<AutocompleteSourceType>();
  labels = input<AutocompleteComponentLabels>();
  minChars = input(0, { transform: numberAttribute });
  filteringDelay = input(400, { transform: numberAttribute });
  searchOnEmpty = input(false, { transform: booleanAttribute });
  trackKey = input<AutocompleteOptionValuePicker | string>('id');
  pickKey = input<AutocompleteOptionValuePicker | string>();
  asyncOptions = input<AutocompleteAsyncOptionsFn>();
  staticOptions = input<AutocompleteOption[]>([]);
  staticSearchableFields = input<string[]>(['id']);
  showEmptyOptions = input(true, { transform: booleanAttribute });
  width = input('19.25rem');
  offsetY = input('0');

  // Output
  confirmed = output<AutocompleteOption>();

  // Host bindings
  @HostBinding('style.--_width')
  get styleWidth() {
    return this.width();
  }

  @HostBinding('style.--_offset-y')
  get styleOffsetY() {
    return this.offsetY();
  }

  @HostBinding('class.-open')
  get cssClassOpen() {
    return this.isOpen();
  }

  inputId!: string;
  ITEMS_TEMPLATE = AUTOCOMPLETE_ITEMS_TEMPLATE;
  CURRENT_TEMPLATE = AUTOCOMPLETE_CURRENT_TEMPLATE;
  isLoading = this.svc.loading;
  isOpen = this.svc.open;
  options = this.svc.options;
  optionTemplate = this.svc.optionTemplate;
  focusedIndex = this.svc.focusedIndex;
  focusedId = this.svc.focusedId;
  currentOptionsTemplate = computed(() => this.computeCurrentOptionsTemplate());

  private nativeInput!: HTMLInputElement;
  private clickOut = createClickOutController(
    this.host.nativeElement,
    () => this.onClickOut(),
    'mousedown'
  );

  onStaticOptionsChangeEffect = effect(() => {
    if (this.sourceType() !== AUTOCOMPLETE_SOURCE_TYPE.STATIC) return;
    if (!this.staticOptions()?.length) return;
    this.svc.updateStaticOptions(this.staticOptions());
  });

  ngOnInit() {
    this.svc.sourceType = this.sourceType();
    this.svc.setValuePicker(this.pickKey());
    this.initInputElement();
    this.initSource();
    this.setupAsyncSource();
    this.setupStaticSource();
    this.listenToConfirmOptionEvent();
    this.initClickOut();
  }

  @HostListener('mousemove')
  onMouseMove(): void {
    this.svc.clearFocused();
  }

  onConfirmOption(event: Event, option: AutocompleteOption): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.svc.confirm(option);
  }

  private initInputElement(): void {
    const inputComponent = this.inputComponent();
    this.nativeInput = inputComponent.getNativeElement();
    this.inputId = inputComponent.id()!;
    this.svc.setInputElement(
      this.nativeInput,
      this.filteringDelay(),
      this.searchOnEmpty(),
      this.minChars()
    );
  }

  private initSource(): void {
    switch (this.sourceType()) {
      case AUTOCOMPLETE_SOURCE_TYPE.STATIC:
        if (!this.staticOptions()?.length) {
          throw new Error('Missing static options');
        }
        let fields = this.staticSearchableFields();
        this.svc.setStaticSearchableFields(fields?.length ? fields : ['id']);
        break;

      case AUTOCOMPLETE_SOURCE_TYPE.ASYNC:
        const asyncOptions = this.asyncOptions();
        if (!asyncOptions) {
          throw new Error('Missing async options function');
        }
        this.svc.setAsyncOptions(asyncOptions);
        break;
    }
  }

  private listenToConfirmOptionEvent(): void {
    const valuePicker = this.svc.getValuePicker();
    this.svc.confirmedEvent.subscribe((option) => {
      const value = valuePicker(option);
      this.inputComponent().setValue(value);
      this.confirmed.emit(option);
      this.svc.closeDropdown();
    });
  }

  private setupAsyncSource(): void {
    if (this.sourceType() !== AUTOCOMPLETE_SOURCE_TYPE.ASYNC) {
      return;
    }

    const asyncOptions = this.asyncOptions();
    if (!asyncOptions) {
      throw new Error('Missing async options function');
    }

    this.svc.setAsyncOptions(asyncOptions);
  }

  private setupStaticSource(): void {
    if (this.sourceType() !== AUTOCOMPLETE_SOURCE_TYPE.STATIC) {
      return;
    }

    if (!this.staticOptions()?.length) {
      throw new Error('Missing static options');
    }

    const staticSearchableFields = this.staticSearchableFields();
    const fields = staticSearchableFields?.length
      ? staticSearchableFields
      : ['id'];

    this.svc.setStaticSearchableFields(fields);
  }

  private computeCurrentOptionsTemplate(): AutocompleteCurrentTemplate | null {
    if (this.isLoading()) {
      return AUTOCOMPLETE_CURRENT_TEMPLATE.LOADING;
    }

    if (!!this.options().length) {
      return AUTOCOMPLETE_CURRENT_TEMPLATE.OPTIONS;
    }

    if (this.showEmptyOptions()) {
      return AUTOCOMPLETE_CURRENT_TEMPLATE.EMPTY;
    }

    return null;
  }

  private initClickOut(): void {
    this.svc.opened.subscribe(() => {
      this.clickOut.start();
    });

    this.svc.closed.subscribe(() => {
      this.clickOut.stop();
    });
  }

  private onClickOut(): void {
    this.svc.closeDropdown();
    this.nativeInput.focus();
  }
}
