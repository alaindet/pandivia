import { NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { AUTOCOMPLETE_EXPORTS, AutocompleteAsyncOptionsFn, AutocompleteOption, BaseModalComponent, ButtonComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent, TextareaComponent, ToggleComponent } from '@app/common/components';
import { FieldErrorIdPipe, FieldErrorPipe, FieldStatusPipe } from '@app/common/pipes';
import { FormOption } from '@app/common/types';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { InventoryItem } from '@app/features/inventory';
import { inventoryItemActions, inventoryItemsAsyncReadActions } from '@app/features/inventory/store';
import { TranslocoModule } from '@ngneat/transloco';
import { listItemActions, selectListCategoriesByName, selectListIsLoading, selectListItemModalSuccessCounter, selectListItemNameAutocompleteItems } from '../../store';
import { ListItem } from '../../types';
import { uniqueListItemNameValidator } from '../../validators';
import { LIST_ITEM_FORM_FIELD as FIELD } from './fields';
import { CreateListItemFormModalOutput, EditListItemFormModalOutput, ListItemFormModalInput, ListItemFormModalOutput } from './types';

const imports = [
  MatIconModule,
  NgIf,
  ReactiveFormsModule,
  ModalHeaderDirective,
  ModalFooterDirective,
  ...FORM_FIELD_EXPORTS,
  ...AUTOCOMPLETE_EXPORTS,
  TranslocoModule,
  TextInputComponent,
  QuickNumberComponent,
  SelectComponent,
  ToggleComponent,
  TextareaComponent,
  ButtonComponent,
  FieldStatusPipe,
  FieldErrorPipe,
  FieldErrorIdPipe,
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

  FIELD = FIELD;
  theForm!: FormGroup;
  isEditing = signal(false);
  isSaving = this.store.selectSignal(selectListIsLoading);

  get fName() { return fDescribe(this.theForm, FIELD.NAME.id) }
  get fAmount() { return fDescribe(this.theForm, FIELD.AMOUNT.id) }
  get fDesc() { return fDescribe(this.theForm, FIELD.DESCRIPTION.id) }
  get fCategory() { return fDescribe(this.theForm, FIELD.CATEGORY.id) }
  get fDone() { return fDescribe(this.theForm, FIELD.IS_DONE.id) }

  ngOnInit() {
    this.store.dispatch(inventoryItemsAsyncReadActions.fetchItems());
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

  private onEdit() {

    let item: ListItem = {
      id: this.modal.data.item!.id,
      ...this.theForm.value,
    };

    if (!item.description) {
      const { description, ...theItem } = item;
      item = theItem;
    }

    if (!item.category) {
      const { category, ...theItem } = item;
      item = theItem;
    }

    // Listen to response, then close the modal
    this.afterCreateOrEditSuccess(() => {
      const data: EditListItemFormModalOutput = { item };
      this.modal.confirm(data);
    });

    // Try to edit
    this.store.dispatch(listItemActions.edit({ item }));
  }

  private onCreate() {

    let {
      [FIELD.ADD_TO_INVENTORY.id]: addToInventory,
      ...item
    } = this.theForm.value;

    if (!item.description) {
      const { description, ...theItem } = item;
      item = theItem;
    }

    if (!item.category) {
      const { category, ...theItem } = item;
      item = theItem;
    }

    // Listen to response, then close the modal
    this.afterCreateOrEditSuccess(() => {
      const data: CreateListItemFormModalOutput = { item, addToInventory };
      this.modal.confirm(data);
    });

    // Try to create
    this.store.dispatch(listItemActions.create({ dto: item }));

    // Try to add to inventory
    if (addToInventory) {
      const { amount, ...dto } = item;
      this.store.dispatch(inventoryItemActions.create({ dto }));
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
      map(categories => categories.map(category => {
        return { value: category, label: category };
      })),
    );
  };

  private initForm(): void {
    const { item, category } = this.modal.data;
    const { required, minLength, maxLength, min, max } = Validators;

    const defaultCategory = !!this.modal.data?.item
      ? item?.category ?? ''
      : category ?? '';

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
        defaultCategory,
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

    let first = true;

    this.store.select(selectListItemModalSuccessCounter).subscribe(() => {
      if (first) {
        first = false;
        return;
      }
      fn();
    });
  }
}
