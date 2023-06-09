import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { filter, fromEvent, Observable, of, switchMap, take, takeUntil } from 'rxjs';

import { DataSource, EventSource, OnceSource } from '@app/common/sources';
import { KEYBOARD_KEY as KB } from '@app/common/types';
import { createDebouncedInputEvent } from '@app/common/utils';
import { AutocompleteOption, AutocompleteSourceType, AutocompleteAsyncOptionsFn, AutocompleteOptionValuePicker, AUTOCOMPLETE_SOURCE_TYPE } from './types';

@Injectable()
export class AutocompleteService implements OnDestroy {

  private once = new OnceSource();
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
  optionTemplate = new DataSource<TemplateRef<AutocompleteOption> | null>(null, this.once.event$);
  options = new DataSource<AutocompleteOption[]>([], this.once.event$);
  open = new DataSource<boolean>(false, this.once.event$);
  loading = new DataSource<boolean>(false, this.once.event$);
  focusedIndex = new DataSource<number | null>(null, this.once.event$);
  focusedId = new DataSource<string | null>(null, this.once.event$);

  // Event sources
  confirmedEvent = new EventSource<AutocompleteOption>(this.once.event$);

  ngOnDestroy() {
    this.once.trigger();
  }

  clearFocused(): void {
    this.focusedIndex.next(null);
    this.updateFocusedId(null);
  }

  setOptionTemplate(template: TemplateRef<AutocompleteOption>): void {
    this.optionTemplate.next(template);
  }

  setInputElement(
    element: HTMLInputElement,
    delay: number,
    searchOnEmpty: boolean,
    minChars = 0,
  ): void {
    element.autocomplete = 'off';
    this.listenToFocusAndBlur(element);
    this.listenToQuery(element, delay, searchOnEmpty, minChars);
    this.listenToKeyboardControls(element);
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
    const searchableOptions = this.createStaticSearchableOptions(options, fields);
    this.staticSearchableOptions = searchableOptions;
  }

  closeDropdown(): void {
    this.open.next(false);
    this.focusedIndex.next(null);
    this.updateFocusedId(null);
  }

  setValuePicker(_picker?: AutocompleteOptionValuePicker | string): void {
    switch (typeof _picker) {
      case 'function':
        this.valuePicker = _picker;
        break;
      case 'string':
        this.valuePicker = (option: AutocompleteOption): string => option[_picker];
        break;
      case 'undefined':
        this.valuePicker = (option: AutocompleteOption): string => JSON.stringify(option);
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

  private listenToFocusAndBlur(element: HTMLInputElement): void {

    fromEvent<Event>(element, 'focus')
      .pipe(
        takeUntil(this.once.event$),
        filter(() => !!element.value),
      )
      .subscribe(() => {
        this.onQuery(element.value);
        this.open.next(true);
      });
  }

  // TODO
  private listenToQuery(
    element: HTMLInputElement,
    delay: number,
    searchOnEmpty: boolean,
    minChars = 0,
  ): void {
    let source$ = createDebouncedInputEvent(element, delay).pipe(
      takeUntil(this.once.event$),
    );

    if (!searchOnEmpty) {
      source$ = source$.pipe(filter(val => val !== ''));
    }

    if (minChars) {
      source$ = source$.pipe(filter(val => val.length >= minChars));
    }

    source$
      .pipe(switchMap(val => of(val)))
      .subscribe(query => this.onQuery(query as string));
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

    shouldOpenEarly && this.open.next(true);
    this.loading.next(true);
    options$.pipe(take(1)).subscribe(options => {
      this.currentOptionsCount = options.length;
      this._options = options;
      this.options.next(options);
      this.loading.next(false);
      this.focusedIndex.next(null);
      this.updateFocusedId(null);
      this.open.next(true);
    });
  }

  private listenToKeyboardControls(element: HTMLInputElement): void {
    fromEvent<KeyboardEvent>(element, 'keydown')
      .pipe(takeUntil(this.once.event$))
      .subscribe(event => {

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
    fields: string[],
  ): AutocompleteOption[] {
    return options.map(option => {
      const data: any = [];
      fields.forEach(field => data.push(option[field]));
      return JSON.stringify(data).slice(1, -1);
    });
  }

  private focusLast(): void {
    this.openDropdownIfNeeded();
    const index = this._options.length - 1;
    this.focusedIndex.next(index);
    this.updateFocusedId(index);
  }

  private focusFirst(): void {
    this.openDropdownIfNeeded();
    this.focusedIndex.next(0);
    this.updateFocusedId(0);
  }

  private focusPrevious(): void {
    this.openDropdownIfNeeded();
    const focusedIndex = this.focusedIndex.getCurrent();
    if (focusedIndex === null) return this.focusLast();
    const firstIndex = 0;
    if (focusedIndex === firstIndex) return this.focusLast();
    const index = focusedIndex - 1;
    this.focusedIndex.next(index);
    this.updateFocusedId(index);
  }

  private focusNext(): void {
    this.openDropdownIfNeeded();
    const focusedIndex = this.focusedIndex.getCurrent();
    if (focusedIndex === null) return this.focusFirst();
    const lastIndex = this.currentOptionsCount - 1;
    if (focusedIndex === lastIndex) return this.focusFirst();
    const index = focusedIndex + 1;
    this.focusedIndex.next(index);
    this.updateFocusedId(index);
  }

  confirm(option: AutocompleteOption): void {
    this.focusedIndex.next(null);
    this.open.next(false);
    this.confirmedEvent.next(option);
  }

  private confirmFocused(): void {
    const focusedIndex = this.focusedIndex.getCurrent();
    const confirmedOption = this._options[focusedIndex as number];
    this.focusedIndex.next(null);
    this.updateFocusedId(null);
    this.open.next(false);
    this.confirmedEvent.next(confirmedOption);
  }

  private openDropdownIfNeeded(): void {
    const open = this.open.getCurrent();
    if (!open) this.open.next(true);
  }

  private updateFocusedId(focusedIndex: number | null): void {
    if (focusedIndex === null) {
      this.focusedId.next(null);
      return;
    }
    const valuePicker = this.getValuePicker();
    this.focusedId.next(valuePicker(this._options[focusedIndex]));
  }
}
