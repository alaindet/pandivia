import { NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { AUTOCOMPLETE_EXPORTS, AutocompleteAsyncOptionsFn, AutocompleteOption, BaseModalComponent, ButtonComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent, TextareaComponent, ToggleComponent } from '@app/common/components';
import { FormOption } from '@app/common/types';
import { CreateInventoryItemDto, InventoryItem } from '@app/core';
import { inventoryItemActions, selectInventoryCategoriesByName, selectInventoryIsLoading, selectInventoryItemModalSuccessCounter } from '../../store';
import { CreateInventoryItemFormModalOutput, EditInventoryItemFormModalOutput, INVENTORY_ITEM_FORM_FIELD as FIELD, InventoryItemFormModalInput, InventoryItemFormModalOutput } from './types';

const IMPORTS = [
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
];

@Component({
  selector: 'app-inventory-item-form-modal',
  standalone: true,
  imports: IMPORTS,
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
  // isEditing = signal(this.modal.data.item !== null);
  isEditing = signal(false);
  isSaving = this.store.selectSignal(selectInventoryIsLoading);

  get fName(): FormControl { return this.getField(FIELD.NAME) }
  get fDesc(): FormControl { return this.getField(FIELD.DESCRIPTION) }
  get fCategory(): FormControl { return this.getField(FIELD.CATEGORY) }

  ngOnInit() {
    this.isEditing.set(!!this.modal.data?.item);
    this.initForm();
  }

  onConfirmName(option: AutocompleteOption) {
    this.fName.setValue(option.label);
  }

  onConfirmCategory(option: AutocompleteOption) {
    this.fCategory.setValue(option.label);
  }

  onCancel() {
    this.modal.cancel();
  }

  onSubmit() {
    this.isEditing()
      ? this.onEdit()
      : this.onCreate();
  }

  onEdit() {

    if (this.theForm.invalid) {
      return;
    }

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

  onCreate() {

    if (this.theForm.invalid) {
      return;
    }

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

  categoryFieldOptions: AutocompleteAsyncOptionsFn = (
    query: string,
  ): Observable<FormOption[]> => {
    return this.store.select(selectInventoryCategoriesByName(query)).pipe(
      map(categories => categories.map(category => {
        return { value: category, label: category };
      })),
    );
  };

  private initForm(): void {
    const { item, category } = this.modal.data;
    const { required, minLength, maxLength } = Validators;

    const defaultCategory = !!this.modal.data?.item
      ? item?.category ?? ''
      : category ?? '';

    const controls: any = {
      [FIELD.NAME]: [
        // Value
        item?.name ?? '',
        // Sync validators
        [required, minLength(2), maxLength(100)],
        // Async validators,
        // TODO ...
      ],
      [FIELD.DESCRIPTION]: [item?.description ?? '', [minLength(2), maxLength(100)]],
      [FIELD.CATEGORY]: [defaultCategory, [minLength(2), maxLength(100)]],
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

  private getField(field: string): FormControl {
    return this.theForm.get(field)! as FormControl;
  }
}
