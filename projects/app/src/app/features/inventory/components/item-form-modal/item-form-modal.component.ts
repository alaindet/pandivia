import { NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { AUTOCOMPLETE_EXPORTS, AutocompleteAsyncOptionsFn, AutocompleteOption, BaseModalComponent, ButtonComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent, TextareaComponent, ToggleComponent } from '@app/common/components';
import { FieldErrorPipe, FieldErrorIdPipe, FieldStatusPipe } from '@app/common/pipes';
import { FormOption } from '@app/common/types';
import { getFieldDescriptor as fDescribe } from '@app/common/utils';
import { inventoryItemActions, selectInventoryCategoriesByName, selectInventoryIsLoading, selectInventoryItemModalSuccessCounter } from '../../store';
import { CreateInventoryItemDto, InventoryItem } from '../../types';
import { CreateInventoryItemFormModalOutput, EditInventoryItemFormModalOutput, InventoryItemFormModalInput, InventoryItemFormModalOutput } from './types';
import { INVENTORY_ITEM_FORM_FIELD as FIELD } from './field';

const imports = [
  MatIconModule,
  NgIf,
  ReactiveFormsModule,
  ModalHeaderDirective,
  ModalFooterDirective,
  ...FORM_FIELD_EXPORTS,
  ...AUTOCOMPLETE_EXPORTS,
  TextInputComponent,
  QuickNumberComponent,
  SelectComponent,
  ToggleComponent,
  TextareaComponent,
  ButtonComponent,
  TranslocoModule,
  FieldStatusPipe,
  FieldErrorPipe,
  FieldErrorIdPipe,
];

@Component({
  selector: 'app-inventory-item-form-modal',
  standalone: true,
  imports,
  templateUrl: './item-form-modal.component.html',
  styleUrls: ['./item-form-modal.component.scss'],
})
export class InventoryItemFormModalComponent extends BaseModalComponent<
  InventoryItemFormModalInput,
  InventoryItemFormModalOutput
> implements OnInit {

  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  FIELD = FIELD;
  theForm!: FormGroup;
  isEditing = signal(false);
  isSaving = this.store.selectSignal(selectInventoryIsLoading);

  get fName() { return fDescribe(this.theForm, FIELD.NAME.id) }
  get fDesc() { return fDescribe(this.theForm, FIELD.DESCRIPTION.id) }
  get fCategory() { return fDescribe(this.theForm, FIELD.CATEGORY.id) }

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
    return this.store.select(selectInventoryCategoriesByName(query)).pipe(
      map(categories => categories.map(category => {
        return { value: category, label: category };
      })),
    );
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

  private onEdit() {

    let item: InventoryItem = {
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
      const data: EditInventoryItemFormModalOutput = { item };
      this.modal.confirm(data);
    });

    // Try to edit
    this.store.dispatch(inventoryItemActions.edit({ item }));
  }

  private onCreate() {

    let item: CreateInventoryItemDto = this.theForm.value;

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
      const data: CreateInventoryItemFormModalOutput = { item };
      this.modal.confirm(data);
    });

    // Try to create
    this.store.dispatch(inventoryItemActions.create({ dto: item }));
  }

  private initForm(): void {
    const { item, category } = this.modal.data;
    const { required, minLength, maxLength } = Validators;

    const defaultCategory = !!this.modal.data?.item
      ? item?.category ?? ''
      : category ?? '';

    const controls: any = {
      [FIELD.NAME.id]: [
        item?.name ?? '',
        [required, minLength(2), maxLength(100)],
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

    this.theForm = this.formBuilder.group(controls);
  }

  private afterCreateOrEditSuccess(fn: () => void): void {

    let first = true;

    this.store.select(selectInventoryItemModalSuccessCounter).subscribe(() => {
      if (first) {
        first = false;
        return;
      }
      fn();
    });
  }
}
