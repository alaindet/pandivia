import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { auditTime, combineLatest, map, startWith } from 'rxjs';

import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { SIXTY_FRAMES_PER_SECOND } from '@app/common/constants';
import { filterNull } from '@app/common/rxjs';
import { didInputChange } from '@app/common/utils';
import { TextInputComponent } from '../text-input';
import { AutocompleteOptionComponent } from './autocomplete-option.component';
import { AutocompleteService } from './autocomplete.service';
import { AUTOCOMPLETE_SOURCE_TYPE, AutocompleteAsyncOptionsFn, AutocompleteOption, AutocompleteOptionValuePicker, AutocompleteSourceType } from './types';

const IMPORTS = [
  NgIf,
  NgFor,
  AsyncPipe,
  NgTemplateOutlet,
  AutocompleteOptionComponent,
];

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [AutocompleteService],
  host: { class: 'app-autocomplete' },
})
export class AutocompleteComponent implements OnInit, OnChanges, OnDestroy {

  @Input() inputComponent!: TextInputComponent;
  @Input() minChars?: number;
  @Input() sourceType!: AutocompleteSourceType;
  @Input() filteringDelay = 400;
  @Input() searchOnEmpty = false;
  @Input() pickKey?: AutocompleteOptionValuePicker | string;
  @Input() asyncOptions?: AutocompleteAsyncOptionsFn;
  @Input() staticOptions?: AutocompleteOption[] = [];
  @Input() staticSearchableFields?: string[] = ['id'];
  @Input() @HostBinding('style.--app-autocomplete-width') width = '19.25rem';
  @Input() @HostBinding('style.--app-autocomplete-offset-y') offsetY = '0';

  @Output() confirmed = new EventEmitter<AutocompleteOption>();
  
  @HostBinding('class.-open') cssOpen = false;

  inputId!: string;
  
  vm$ = combineLatest({
    isLoading: this.svc.loading.data$,
    options: this.svc.options.data$,
    optionTemplate: this.svc.optionTemplate.data$.pipe(filterNull()),
    isOpen: this.svc.open.data$,
    focusedIndex: this.svc.focusedIndex.data$,
    focusedId: this.svc.focusedId.data$,
  }).pipe(
    startWith(null),
    auditTime(SIXTY_FRAMES_PER_SECOND),
  );

  private onClickOutRef!: (e: MouseEvent) => void;
  private nativeInput!: HTMLInputElement;

  constructor(
    private svc: AutocompleteService,
    private host: ElementRef,
  ) {}

  ngOnInit() {
    this.svc.sourceType = this.sourceType;
    this.svc.setValuePicker(this.pickKey);
    this.initInputElement();
    this.initSource();
    this.setupAsyncSource();
    this.setupStaticSource();
    this.listenToConfirmOptionEvent();
    this.initClickOut();

    // TODO: Move?
    this.vm$.pipe(map(vm => !!vm?.isOpen)).subscribe(isOpen => this.cssOpen = isOpen);
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
    this.nativeInput = this.inputComponent.getNativeElement();
    this.inputId = this.inputComponent.id!;
    this.svc.setInputElement(
      this.nativeInput,
      this.filteringDelay,
      this.searchOnEmpty,
      this.minChars,
    );
  }

  private initSource(): void {
    switch (this.sourceType) {

      case AUTOCOMPLETE_SOURCE_TYPE.STATIC:
        if (!this.staticOptions?.length) throw new Error('Missing static options');
        let fields = this.staticSearchableFields;
        this.svc.setStaticSearchableFields(fields?.length ? fields : ['id']);
        break;
        
      case AUTOCOMPLETE_SOURCE_TYPE.ASYNC:
        if (!this.asyncOptions) throw new Error('Missing async options function');
        this.svc.setAsyncOptions(this.asyncOptions);
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
    if (!this.svc.open.getCurrent()) return;
    if (this.host.nativeElement.contains(event.target)) return;
    this.nativeInput.focus();
    this.svc.closeDropdown();
  }

  private listenToConfirmOptionEvent(): void {
    const valuePicker = this.svc.getValuePicker();
    this.svc.confirmedEvent.event$.subscribe(option => {
      const value = valuePicker(option);
      this.inputComponent.setValue(value);
      this.confirmed.emit(option);
    });
  }

  private setupAsyncSource(): void {
    if (this.sourceType !== AUTOCOMPLETE_SOURCE_TYPE.ASYNC) return;
    if (!this.asyncOptions) throw new Error('Missing async options function');
    this.svc.setAsyncOptions(this.asyncOptions);
  }

  private setupStaticSource(): void {
    if (this.sourceType !== AUTOCOMPLETE_SOURCE_TYPE.STATIC) return;
    if (!this.staticOptions?.length) throw new Error('Missing static options');
    const fields = this.staticSearchableFields?.length
      ? this.staticSearchableFields
      : ['id'];
    this.svc.setStaticSearchableFields(fields);
  }

  private updateStaticOptions(staticOptionsChange?: SimpleChange): void {
    if (this.sourceType !== AUTOCOMPLETE_SOURCE_TYPE.STATIC) return;
    if (!didInputChange(staticOptionsChange)) return;
    if (!this.staticOptions?.length) return;
    this.svc.updateStaticOptions(this.staticOptions);
  }
}
