import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, OnInit, OnDestroy, Output, SimpleChange, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { filter, tap } from 'rxjs';

import { didInputChange } from '@app/common/utils';
import { DataSource } from '@app/common/sources';
import { TextInputComponent } from '../text-input';
import { AutocompleteService } from './autocomplete.service';
import { AutocompleteOption, AutocompleteSource, AutocompleteAsyncOptionsFn, AutocompleteOptionValuePicker, AUTOCOMPLETE_SOURCE } from './types';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AutocompleteOptionComponent } from './autocomplete-option.component';

const IMPORTS = [
  NgIf,
  NgFor,
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
  @Input() minChar?: number;
  @Input() source!: AutocompleteSource;
  @Input() filteringDelay = 400;
  @Input() searchOnEmpty = false;
  @Input() pickValue?: AutocompleteOptionValuePicker | string;
  @Input() asyncOptions?: AutocompleteAsyncOptionsFn;
  @Input() staticOptions?: AutocompleteOption[] = [];
  @Input() staticSearchableFields?: string[] = ['id'];
  @Input() @HostBinding('style.--app-autocomplete-width') width = '19.25rem';

  @Output() confirmed = new EventEmitter<AutocompleteOption>();

  t__options: AutocompleteOption[] = [];
  t__optionTemplate!: TemplateRef<AutocompleteOption>;
  @HostBinding('class.-open') t__open = false;
  t__loading = false;
  t__focusedIndex: number | null = null;
  t__inputId!: string;
  t__focusedId!: string | null;
  // t__valuesMap!: OptionValuesMap;

  private onClickOutRef!: (e: MouseEvent) => void;
  private nativeInput!: HTMLInputElement;

  constructor(
    private svc: AutocompleteService,
    private host: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.svc.source = this.source;
    this.svc.setValuePicker(this.pickValue);
    this.initInputElement();
    this.setupAsyncSource();
    this.setupStaticSource();
    this.watchState();
    this.watchEvents();
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
    this.nativeInput = this.inputComponent.getNativeElement();
    this.t__inputId = this.inputComponent.id!;
    this.svc.setInputElement(
      this.nativeInput,
      this.filteringDelay,
      this.searchOnEmpty,
      this.minChar,
    );
  }

  private initClickOut(): void {
    this.onClickOutRef = this.onClickOut.bind(this);
    window.addEventListener('mousedown', this.onClickOutRef, true);
  }

  private destroyClickOut(): void {
    window.removeEventListener('mousedown', this.onClickOutRef);
  }

  private onClickOut(event: any): void {
    if (!this.t__open) return;
    if (this.host.nativeElement.contains(event.target)) return;
    this.nativeInput.focus();
    this.svc.closeDropdown();
  }

  private watchState(): void {
    this.svc.optionTemplate.data$
      .pipe(filter(x => x !== null))
      .subscribe(x => {
        this.t__optionTemplate = x as TemplateRef<AutocompleteOption>;
        this.cdr.detectChanges();
      });

    // TODO: Optimize? Too many detectChanges
    const syncData = <T>(source: DataSource<T>, fn: (data: T) => void): void => {
      source.data$.pipe(tap(data => {
        fn(data);
        this.cdr.detectChanges();
      })).subscribe();
    };

    syncData(this.svc.options, x => this.t__options = x);
    syncData(this.svc.open, x => this.t__open = x);
    syncData(this.svc.loading, x => this.t__loading = x);
    syncData(this.svc.focusedIndex, x => this.t__focusedIndex = x);
    syncData(this.svc.focusedId, x => this.t__focusedId = x);
  }

  private watchEvents(): void {
    this.listenToConfirmOptionEvent();
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
    if (this.source !== AUTOCOMPLETE_SOURCE.ASYNC) return;
    if (!this.asyncOptions) throw new Error('Missing async options function');
    this.svc.setAsyncOptions(this.asyncOptions);
  }

  private setupStaticSource(): void {
    if (this.source !== AUTOCOMPLETE_SOURCE.STATIC) return;
    if (!this.staticOptions?.length) throw new Error('Missing static options');
    const fields = this.staticSearchableFields?.length
      ? this.staticSearchableFields
      : ['id'];
    this.svc.setStaticSearchableFields(fields);
  }

  private updateStaticOptions(staticOptionsChange?: SimpleChange): void {
    if (this.source !== 'static') return;
    if (!didInputChange(staticOptionsChange)) return;
    if (!this.staticOptions?.length) return;
    this.svc.updateStaticOptions(this.staticOptions);
  }
}
