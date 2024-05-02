import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewEncapsulation, computed, input, output } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { didInputChange } from '@app/common/utils';
import { TextInputComponent } from '../text-input';
import { AutocompleteOptionComponent } from './autocomplete-option.component';
import { AutocompleteService } from './autocomplete.service';
import { AUTOCOMPLETE_CURRENT_TEMPLATE, AUTOCOMPLETE_ITEMS_TEMPLATE, AUTOCOMPLETE_SOURCE_TYPE, AutocompleteAsyncOptionsFn, AutocompleteComponentLabels, AutocompleteCurrentTemplate, AutocompleteOption, AutocompleteOptionValuePicker, AutocompleteSourceType } from './types';

const imports = [
  NgTemplateOutlet,
  AutocompleteOptionComponent,
];

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports,
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  host: { class: 'app-autocomplete' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [AutocompleteService],
})
export class AutocompleteComponent implements OnInit, OnChanges, OnDestroy {

  // Input
  inputComponent = input.required<TextInputComponent>();
  sourceType = input.required<AutocompleteSourceType>();
  labels = input<AutocompleteComponentLabels>();
  minChars = input<number>();
  filteringDelay = input(400);
  searchOnEmpty = input(false);
  trackKey = input<AutocompleteOptionValuePicker | string>('id');
  pickKey = input<AutocompleteOptionValuePicker | string>();
  asyncOptions = input<AutocompleteAsyncOptionsFn>();
  staticOptions = input<AutocompleteOption[]>([]);
  staticSearchableFields = input<string[]>(['id']);
  showEmptyOptions = input(true);
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

  private onClickOutRef!: (e: MouseEvent) => void;
  private nativeInput!: HTMLInputElement;

  constructor(
    private svc: AutocompleteService,
    private host: ElementRef,
  ) {}

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

  ngOnChanges(changes: SimpleChanges) {
    this.updateStaticOptions(changes['staticOptions']);
  }

  ngOnDestroy() {
    this.destroyClickOut();
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
    this.inputId = inputComponent.id!;
    this.svc.setInputElement(
      this.nativeInput,
      this.filteringDelay(),
      this.searchOnEmpty(),
      this.minChars(),
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

  private initClickOut(): void {
    this.onClickOutRef = this.onClickOut.bind(this);
    window.addEventListener('mousedown', this.onClickOutRef, true);
  }

  private destroyClickOut(): void {
    window.removeEventListener('mousedown', this.onClickOutRef);
  }

  private onClickOut(event: any): void {

    if (this.host.nativeElement.contains(event.target)) {
      return;
    }

    this.nativeInput.focus();
    this.svc.closeDropdown();
  }

  private listenToConfirmOptionEvent(): void {
    const valuePicker = this.svc.getValuePicker();
    this.svc.confirmedEvent.event$.subscribe(option => {
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

  private updateStaticOptions(staticOptionsChange?: SimpleChange): void {
    if (this.sourceType() !== AUTOCOMPLETE_SOURCE_TYPE.STATIC) {
      return;
    }

    if (!didInputChange(staticOptionsChange)) {
      return;
    }

    if (!this.staticOptions()?.length) {
      return;
    }

    this.svc.updateStaticOptions(this.staticOptions());
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
}
