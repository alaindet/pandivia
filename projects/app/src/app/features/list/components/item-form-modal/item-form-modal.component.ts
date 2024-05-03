import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';

import { DEFAULT_CATEGORY } from '@app/core/constants';
import { AUTOCOMPLETE_EXPORTS, AutocompleteAsyncOptionsFn, AutocompleteOption, BaseModalComponent, ButtonComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent, TextareaComponent, ToggleComponent } from '@app/common/components';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { FormOption } from '@app/common/types';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { InventoryItem } from '@app/features/inventory';
import { inventoryCloneItemFromList, inventoryCreateItem, inventoryFetchItems } from '@app/features/inventory/store';
import { TranslocoModule } from '@ngneat/transloco';
import { listCreateItem, listEditItem, selectListCategoriesByName, selectListIsLoading, selectListItemModalSuccessCounter, selectListItemNameAutocompleteItems } from '../../store';
import { ListItem } from '../../types';
import { uniqueListItemNameValidator } from '../../validators';
import { LIST_ITEM_FORM_FIELD as FIELD } from './fields';
import { CreateListItemFormModalOutput, EditListItemFormModalOutput, ListItemFormModalInput, ListItemFormModalOutput } from './types';
import { UiService } from '@app/core';
import { MediaQueryService } from '../../../../common/services';
import { toSignal } from '@angular/core/rxjs-interop';

const imports = [
  NgIf,
  ReactiveFormsModule,
  MatIconModule,
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
  selector: 'app-list-item-form-modal',
  standalone: true,
  imports,
  templateUrl: './item-form-modal.component.html',
  styleUrls: ['./item-form-modal.component.scss'],
})
export class ListItemFormModalComponent extends BaseModalComponent<
  ListItemFormModalInput,
  ListItemFormModalOutput
> implements OnInit {

  private store = inject(Store);
  private formBuilder = inject(FormBuilder);
  private ui = inject(UiService);
  private mediaQuery = inject(MediaQueryService);

  private mobileQuery = toSignal(this.mediaQuery.getFromMobileDown());
  isMobile = computed(() => !!this.mobileQuery());

  FIELD = FIELD;
  theForm!: FormGroup;
  isEditing = signal(false);
  isSaving = this.store.selectSignal(selectListIsLoading);
  shouldContinue = false;
  themeConfig = this.ui.theme.config;

  get fName() { return fDescribe(this.theForm, FIELD.NAME.id) }
  get fAmount() { return fDescribe(this.theForm, FIELD.AMOUNT.id) }
  get fDesc() { return fDescribe(this.theForm, FIELD.DESCRIPTION.id) }
  get fCategory() { return fDescribe(this.theForm, FIELD.CATEGORY.id) }
  get fDone() { return fDescribe(this.theForm, FIELD.IS_DONE.id) }

  @ViewChild('nameRef', { read: TextInputComponent })
  nameRef!: TextInputComponent;

  ngOnInit() {
    this.store.dispatch(inventoryFetchItems.try());
    this.isEditing.set(!!this.modal.data?.item);
    this.initForm();
  }

  onConfirmName(option: AutocompleteOption) {
    this.theForm.get(FIELD.NAME.id)!.setValue(option.label);
  }

  onConfirmCategory(option: AutocompleteOption) {
    this.theForm.get(FIELD.CATEGORY.id)!.setValue(option.label);
  }

  onCancel() {

    // TODO: Remove
    console.log('Canceling modal');

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

    let item: ListItem = {
      id: this.modal.data.item!.id,
      ...this.theForm.value,
    };

    if (item.category === '') {
      item.category = DEFAULT_CATEGORY;
    }

    // Listen to response, then close the modal
    this.afterCreateOrEditSuccess(() => {
      const data: EditListItemFormModalOutput = { item };
      this.modal.confirm(data);
    });

    // Try to edit
    this.store.dispatch(listEditItem.try({ item }));
  }

  private onCreate() {

    let {
      [FIELD.ADD_TO_INVENTORY.id]: addToInventory,
      ...item
    } = this.theForm.value;

    if (item.category === '') {
      item.category = DEFAULT_CATEGORY;
    }

    // Listen to response
    this.afterCreateOrEditSuccess(() => {

      // If continuing, reset the form
      if (this.shouldContinue) {

        // Backup category
        const category = this.fCategory.value;

        this.theForm.reset({
          [FIELD.NAME.id]: '',
          [FIELD.AMOUNT.id]: 1,
          [FIELD.DESCRIPTION.id]: '',
          [FIELD.CATEGORY.id]: category,
          [FIELD.ADD_TO_INVENTORY.id]: false,
        });
        this.shouldContinue = false;
        this.nameRef?.focus();
        return;
      }

      // Otherwise close the modal
      const data: CreateListItemFormModalOutput = { item, addToInventory };
      this.modal.confirm(data);
    });

    // Try to create
    this.store.dispatch(listCreateItem.try({ dto: item }));

    // Try to clone this item to the Inventory
    if (addToInventory) {
      const { amount, ...dto } = item;
      this.store.dispatch(inventoryCloneItemFromList.try({ dto }));
    }
  }

  nameFieldOptions: AutocompleteAsyncOptionsFn = (
    query: string,
  ): Observable<FormOption[]> => {
    return this.store.select(selectListItemNameAutocompleteItems(query)).pipe(
      map((items: InventoryItem[]) => {
        return items.map(item => ({ value: item.id, label: item.name }));
      }),
    );
  };

  categoryFieldOptions: AutocompleteAsyncOptionsFn = (
    query: string,
  ): Observable<FormOption[]> => {
    return this.store.select(selectListCategoriesByName(query)).pipe(
      map(categories => {
        const result: FormOption[] = [];
        for (const category of categories) {
          if (category === DEFAULT_CATEGORY) continue;
          result.push({ value: category, label: category });
        }
        return result;
      }),
    );
  };

  private initForm(): void {
    const { item, category } = this.modal.data;
    const { required, minLength, maxLength, min, max } = Validators;

    let fieldCategory = !!this.modal.data?.item
      ? item?.category ?? ''
      : category ?? '';

    if (fieldCategory === DEFAULT_CATEGORY) {
      fieldCategory = '';
    }

    const controls: any = {
      [FIELD.NAME.id]: [
        // Value
        item?.name ?? '',
        // Sync validators
        [required, minLength(2), maxLength(100)],
        // Async validators,
        [uniqueListItemNameValidator(this.store, this.modal.data?.item?.id ?? null)],
      ],
      [FIELD.AMOUNT.id]: [
        item?.amount ?? 1,
        [required, min(1), max(100)],
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

    // Add create-only fields
    if (!this.isEditing()) {
      controls[FIELD.ADD_TO_INVENTORY.id] = [false];
    }

    // Add edit-only fields
    else {
      controls[FIELD.IS_DONE.id] = [!!item?.isDone];
    }

    this.theForm = this.formBuilder.group(controls);
  }

  private afterCreateOrEditSuccess(fn: () => void): void {

    const stop$ = new Subject<void>();
    let first = true;

    this.store.select(selectListItemModalSuccessCounter)
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
