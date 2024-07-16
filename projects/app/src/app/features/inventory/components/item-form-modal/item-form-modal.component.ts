import { Component, Injector, OnInit, inject, signal, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Observable, Subject, map, takeUntil } from 'rxjs';

import { AUTOCOMPLETE_EXPORTS, AutocompleteAsyncOptionsFn, AutocompleteOption, BaseModalComponent, ButtonComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent, TextareaComponent, ToggleComponent } from '@app/common/components';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { MediaQueryService } from '@app/common/services';
import { FormOption } from '@app/common/types';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { DEFAULT_CATEGORY } from '@app/core/constants';
import { CreateInventoryItemDto, InventoryItem } from '../../types';
import { uniqueInventoryItemNameValidator } from '../../validators';
import { INVENTORY_ITEM_FORM_FIELD as FIELD } from './fields';
import { CreateInventoryItemFormModalOutput, EditInventoryItemFormModalOutput, InventoryItemFormModalInput, InventoryItemFormModalOutput } from './types';
import { InventoryStoreFeatureService } from '../../store';

const imports = [
  MatIconModule,
  ReactiveFormsModule,
  TranslocoModule,
  ModalHeaderDirective,
  ModalFooterDirective,
  TextInputComponent,
  QuickNumberComponent,
  SelectComponent,
  ToggleComponent,
  TextareaComponent,
  ButtonComponent,
  ...FORM_FIELD_EXPORTS,
  ...AUTOCOMPLETE_EXPORTS,
  ...FIELD_PIPES_EXPORTS,
];

@Component({
  selector: 'app-inventory-item-form-modal',
  standalone: true,
  imports,
  templateUrl: './item-form-modal.component.html',
  styleUrl: './item-form-modal.component.scss',
})
export class InventoryItemFormModalComponent extends BaseModalComponent<
  InventoryItemFormModalInput,
  InventoryItemFormModalOutput
> implements OnInit {

  private store = inject(InventoryStoreFeatureService);
  private formBuilder = inject(FormBuilder);
  private injector = inject(Injector);

  isMobile = inject(MediaQueryService).getFromMobileDown();

  FIELD = FIELD;
  theForm!: FormGroup;
  isEditing = signal(false);
  isSaving = this.store.isLoading;
  shouldContinue = false;

  get fName() { return fDescribe(this.theForm, FIELD.NAME.id) }
  get fDesc() { return fDescribe(this.theForm, FIELD.DESCRIPTION.id) }
  get fCategory() { return fDescribe(this.theForm, FIELD.CATEGORY.id) }

  nameRef = viewChild.required('nameRef', { read: TextInputComponent });

  ngOnInit() {
    this.isEditing.set(!!this.modal.data?.item);
    this.initForm();
  }

  onConfirmName(option: AutocompleteOption) {
    this.theForm.get(FIELD.NAME.id)!.setValue(option.label);
  }

  onConfirmCategory(option: AutocompleteOption) {
    this.theForm.get(FIELD.CATEGORY.id)!.setValue(option.label);
  }

  categoryFieldOptions: AutocompleteAsyncOptionsFn = (
    query: string,
  ): Observable<FormOption[]> => {

    const categoriesByName$ = toObservable(
      this.store.filterCategoriesByName(query),
      { injector: this.injector },
    );

    return categoriesByName$.pipe(map(categories => {
      const result: FormOption[] = [];
      for (const category of categories) {
        if (category === DEFAULT_CATEGORY) continue;
        result.push({ value: category, label: category });
      }
      return result;
    }));
  };

  onCancel() {
    this.modal.cancel();
  }

  onSubmit() {

    if (this.theForm.invalid) {
      this.theForm.markAllAsTouched();
      return;
    }

    this.isEditing()
      ? this.onEdit()
      : this.onCreate();
  }

  onCreateAndContinue() {
    this.shouldContinue = true;
    this.onSubmit();
  }

  private onEdit() {
    let item: InventoryItem = {
      id: this.modal.data.item!.id,
      ...this.theForm.value,
    };

    if (item.category === '') {
      item.category = DEFAULT_CATEGORY;
    }

    // Listen to response, then close the modal
    this.afterCreateOrEditSuccess(() => {
      const data: EditInventoryItemFormModalOutput = { item };
      this.modal.confirm(data);
    });

    // Try to edit
    this.store.item.edit(item);
  }

  private onCreate() {

    let item: CreateInventoryItemDto = this.theForm.value;

    if (item.category === '') {
      item.category = DEFAULT_CATEGORY;
    }

    // Listen to response
    this.afterCreateOrEditSuccess(() => {

      // If continuing, reset the form
      if (this.shouldContinue) {

        // Backup category
        const category = this.fCategory.value;

        this.theForm.reset();

        // Restore category
        this.theForm.get(FIELD.CATEGORY.id)!.setValue(category);

        this.shouldContinue = false;
        this.nameRef()?.focus();
        return;
      }

      // Otherwise close modal
      const data: CreateInventoryItemFormModalOutput = { item };
      this.modal.confirm(data);
    });

    // Try to create
    this.store.item.create(item);
  }

  private initForm(): void {
    const { item, category } = this.modal.data;
    const { required, minLength, maxLength } = Validators;

    let fieldCategory = !!this.modal.data?.item
      ? item?.category ?? ''
      : category ?? '';

    if (fieldCategory === DEFAULT_CATEGORY) {
      fieldCategory = '';
    }

    const controls: any = {
      [FIELD.NAME.id]: [
        item?.name ?? '',
        // Sync validators
        [required, minLength(2), maxLength(100)],
        // Async validators
        [uniqueInventoryItemNameValidator(this.store, this.modal.data?.item?.id ?? null)],
      ],
      [FIELD.DESCRIPTION.id]: [
        item?.description ?? '',
        [minLength(2), maxLength(100)],
      ],
      [FIELD.CATEGORY.id]: [
        fieldCategory,
        [minLength(2), maxLength(100)],
      ],
    };

    this.theForm = this.formBuilder.group(controls);
  }

  private afterCreateOrEditSuccess(fn: () => void): void {

    const stop$ = new Subject<void>();
    let first = true;

    toObservable(this.store.itemModalSuccessCounter, { injector: this.injector })
      .pipe(takeUntil(stop$))
      .subscribe(() => {
        if (first) {
          first = false;
          return;
        }
        fn();
        stop$.next();
        stop$.complete();
      });
  }
}
