import { Injectable, OnDestroy, TemplateRef, signal } from '@angular/core';
import {
  Observable,
  Subject,
  filter,
  fromEvent,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { KEYBOARD_KEY as KB } from '@common/types';
import { createDebouncedInputEvent } from '@common/utils';

import {
  AUTOCOMPLETE_SOURCE_TYPE,
  AutocompleteAsyncOptionsFn,
  AutocompleteOption,
  AutocompleteOptionValuePicker,
  AutocompleteSourceType,
} from './types';

@Injectable()
export class AutocompleteService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private currentOptionsCount = 0;

  // Async
  private asyncOptionsFn?: AutocompleteAsyncOptionsFn;

  // Static
  private staticOptions?: AutocompleteOption[] = [];
  private staticSearchableOptions: string[] = [];
  private staticSearchableFields: string[] = ['id'];
  private valuePicker!: AutocompleteOptionValuePicker;
  private _options: AutocompleteOption[] = [];

  sourceType!: AutocompleteSourceType;

  // Data sources
  optionTemplate = signal<TemplateRef<AutocompleteOption> | null>(null);
  options = signal<AutocompleteOption[]>([]);
  open = signal(false);
  loading = signal(false);
  focusedIndex = signal<number | null>(null);
  focusedId = signal<string | null>(null);

  // Event sources
  confirmedEvent = new Subject<AutocompleteOption>();
  opened = new Subject<void>();
  closed = new Subject<void>();

  ngOnDestroy() {
    this.confirmedEvent.complete();
    this.opened.complete();
    this.closed.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearFocused(): void {
    this.focusedIndex.set(null);
    this.updateFocusedId(null);
  }

  setOptionTemplate(template: TemplateRef<AutocompleteOption>): void {
    this.optionTemplate.set(template);
  }

  setInputElement(
    element: HTMLInputElement,
    delay: number,
    searchOnEmpty: boolean,
    minChars = 0
  ): void {
    element.autocomplete = 'off';
    this.listenToFocusEvent(element, searchOnEmpty, minChars);
    this.listenToQuery(element, delay, searchOnEmpty, minChars);
    this.listenToKeyboardEvents(element);
  }

  setAsyncOptions(optionsFn: AutocompleteAsyncOptionsFn): void {
    this.asyncOptionsFn = optionsFn;
  }

  setStaticSearchableFields(fields: string[]): void {
    this.staticSearchableFields = fields;
  }

  updateStaticOptions(options: AutocompleteOption[]): void {
    this.staticOptions = options;
    const fields = this.staticSearchableFields;
    const searchableOptions = this.createStaticSearchableOptions(
      options,
      fields
    );
    this.staticSearchableOptions = searchableOptions;
  }

  closeDropdown(): void {
    this.open.set(false);
    this.focusedIndex.set(null);
    this.updateFocusedId(null);
    this.closed.next();
  }

  confirm(option: AutocompleteOption): void {
    this.focusedIndex.set(null);
    this.open.set(false);
    this.confirmedEvent.next(option);
    this.closed.next();
  }

  setValuePicker(_picker?: AutocompleteOptionValuePicker | string): void {
    switch (typeof _picker) {
      case 'function':
        this.valuePicker = _picker;
        break;
      case 'string':
        this.valuePicker = (option: AutocompleteOption): string =>
          option[_picker];
        break;
      case 'undefined':
        this.valuePicker = (option: AutocompleteOption): string =>
          JSON.stringify(option);
        break;
    }
  }

  getValuePicker(): AutocompleteOptionValuePicker {
    return this.valuePicker;
  }

  private staticFilterBy(query: string): AutocompleteOption[] {
    const filteredOptions: AutocompleteOption[] = [];

    for (let i = 0, len = this.staticSearchableOptions.length; i < len; i++) {
      if (this.staticSearchableOptions[i].includes(query)) {
        filteredOptions.push(this.staticOptions![i]);
      }
    }

    return filteredOptions;
  }

  private listenToFocusEvent(
    element: HTMLInputElement,
    searchOnEmpty: boolean,
    minChars = 0
  ): void {
    let focus$ = fromEvent<Event>(element, 'focus').pipe(
      takeUntil(this.destroy$)
    );

    if (!searchOnEmpty) {
      focus$ = focus$.pipe(filter(() => element.value !== ''));
    }

    if (minChars) {
      focus$ = focus$.pipe(filter(() => element.value.length >= minChars));
    }

    focus$.subscribe(() => {
      this.onQuery(element.value);
      this.open.set(true);
      this.opened.next();
    });
  }

  private listenToQuery(
    element: HTMLInputElement,
    delay: number,
    searchOnEmpty: boolean,
    minChars = 0
  ): void {
    let source$ = createDebouncedInputEvent(element, delay).pipe(
      takeUntil(this.destroy$)
    );

    if (!searchOnEmpty) {
      source$ = source$.pipe(filter((val) => val !== ''));
    }

    if (minChars) {
      source$ = source$.pipe(filter((val) => val.length >= minChars));
    }

    source$
      .pipe(switchMap((val) => of(val)))
      .subscribe((query) => this.onQuery(query as string));
  }

  private onQuery(query: string): void {
    let options$: Observable<AutocompleteOption[]>;
    let shouldOpenEarly = false;

    switch (this.sourceType) {
      case AUTOCOMPLETE_SOURCE_TYPE.STATIC:
        options$ = of(this.staticFilterBy(query));
        shouldOpenEarly = false;
        break;
      case AUTOCOMPLETE_SOURCE_TYPE.ASYNC:
        options$ = this.asyncOptionsFn!(query);
        shouldOpenEarly = true;
        break;
    }

    if (shouldOpenEarly) {
      this.open.set(true);
      this.opened.next();
    }

    this.loading.set(true);
    options$.pipe(take(1)).subscribe((options) => {
      this.currentOptionsCount = options.length;
      this._options = options;
      this.options.set(options);
      this.loading.set(false);
      this.focusedIndex.set(null);
      this.updateFocusedId(null);

      if (!this.open()) {
        this.open.set(true);
        this.opened.next();
      }
    });
  }

  private listenToKeyboardEvents(element: HTMLInputElement): void {
    fromEvent<KeyboardEvent>(element, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        switch (event.key) {
          case KB.ARROW_UP:
            this.focusPrevious();
            event.preventDefault();
            event.stopImmediatePropagation();
            break;
          case KB.ARROW_DOWN:
            this.focusNext();
            event.preventDefault();
            event.stopImmediatePropagation();
            break;
          case KB.ENTER:
            this.confirmFocused();
            event.preventDefault();
            event.stopImmediatePropagation();
            break;
          case KB.ESCAPE:
            this.closeDropdown();
            event.preventDefault();
            event.stopImmediatePropagation();
            break;
          case KB.TAB:
            this.closeDropdown();
        }
      });
  }

  // Turns an array of any[] in an array of searchable strings based
  // on given fields, so that the search happens on those fields only
  private createStaticSearchableOptions(
    options: AutocompleteOption[],
    fields: string[]
  ): AutocompleteOption[] {
    return options.map((option) => {
      const data: any = [];
      fields.forEach((field) => data.push(option[field]));
      return JSON.stringify(data).slice(1, -1);
    });
  }

  private focusLast(): void {
    this.openDropdownIfNeeded();
    const index = this._options.length - 1;
    this.focusedIndex.set(index);
    this.updateFocusedId(index);
  }

  private focusFirst(): void {
    this.openDropdownIfNeeded();
    this.focusedIndex.set(0);
    this.updateFocusedId(0);
  }

  private focusPrevious(): void {
    this.openDropdownIfNeeded();
    const focusedIndex = this.focusedIndex();
    if (focusedIndex === null) return this.focusLast();
    const firstIndex = 0;
    if (focusedIndex === firstIndex) return this.focusLast();
    const index = focusedIndex - 1;
    this.focusedIndex.set(index);
    this.updateFocusedId(index);
  }

  private focusNext(): void {
    this.openDropdownIfNeeded();
    const focusedIndex = this.focusedIndex();
    if (focusedIndex === null) return this.focusFirst();
    const lastIndex = this.currentOptionsCount - 1;
    if (focusedIndex === lastIndex) return this.focusFirst();
    const index = focusedIndex + 1;
    this.focusedIndex.set(index);
    this.updateFocusedId(index);
  }

  private confirmFocused(): void {
    const focusedIndex = this.focusedIndex();
    const confirmedOption = this._options[focusedIndex as number];
    this.focusedIndex.set(null);
    this.updateFocusedId(null);
    this.open.set(false);
    this.closed.next();
    this.confirmedEvent.next(confirmedOption);
  }

  private openDropdownIfNeeded(): void {
    const open = this.open();
    if (!open) {
      this.open.set(true);
      this.opened.next();
    }
  }

  private updateFocusedId(focusedIndex: number | null): void {
    if (focusedIndex === null) {
      this.focusedId.set(null);
      return;
    }
    const valuePicker = this.getValuePicker();
    this.focusedId.set(valuePicker(this._options[focusedIndex]));
  }
}
