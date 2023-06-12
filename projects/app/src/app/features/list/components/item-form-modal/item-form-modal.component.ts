import { NgIf } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AUTOCOMPLETE_EXPORTS, AutocompleteAsyncOptionsFn, AutocompleteOption, BaseModalComponent, ButtonComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent, TextareaComponent, ToggleComponent } from '@app/common/components';
import { FormOption } from '@app/common/types';
import { InventoryItem, ListItem } from '@app/core';
import { inventoryFetchItemsActions, inventoryItemActions, selectInventoryItemsByName } from '@app/features/inventory/store';
import { Store } from '@ngrx/store';
import { Observable, filter, finalize, map, tap } from 'rxjs';
import { listItemActions, selectListCategoriesByName, selectListIsLoading, selectListItemModalSuccessCounter } from '../../store';
import { uniqueItemNameValidator } from '../../validators';
import { CreateItemFormModalOutput, EditItemFormModalOutput, ITEM_FORM_FIELD as FIELD, ItemFormModalInput, ItemFormModalOutput } from './types';

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
  selector: 'app-list-item-form-modal',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './item-form-modal.component.html',
  styleUrls: ['./item-form-modal.component.scss'],
})
export class ItemFormModalComponent extends BaseModalComponent<
  ItemFormModalInput,
  ItemFormModalOutput
> implements OnInit {

  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  FIELD = FIELD;
  theForm!: FormGroup;
  isEditing = signal(false);
  isSaving = signal(false);

  get fName(): FormControl {
    return this.theForm.get(FIELD.NAME) as FormControl;
  }

  get fAmount(): FormControl {
    return this.theForm.get(FIELD.AMOUNT) as FormControl;
  }

  get fDesc(): FormControl {
    return this.theForm.get(FIELD.DESCRIPTION) as FormControl;
  }

  get fCategory(): FormControl {
    return this.theForm.get(FIELD.CATEGORY) as FormControl;
  }

  get fDone(): FormControl {
    return this.theForm.get(FIELD.IS_DONE) as FormControl;
  }

  ngOnInit() {
    this.store.dispatch(inventoryFetchItemsActions.fetchItems());
    this.isEditing.set(this.modal.data.item !== null);
    this.initForm();
    this.store.select(selectListIsLoading).subscribe(isLoading => {
      this.isSaving.set(isLoading);
    });
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

  onEdit() {

    if (this.theForm.invalid) {
      return;
    }

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
      const data: EditItemFormModalOutput = { item };
      this.modal.confirm(data);
    });

    // Try to edit
    this.store.dispatch(listItemActions.edit({ item }));
  }

  onCreate() {

    if (this.theForm.invalid) {
      return;
    }

    let { [FIELD.ADD_TO_INVENTORY]: addToInventory, ...item } = this.theForm.value;

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
      const data: CreateItemFormModalOutput = { item, addToInventory };
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

  onSubmit() {
    this.isEditing()
      ? this.onEdit()
      : this.onCreate();
  }

  nameFieldOptions: AutocompleteAsyncOptionsFn = (
    query: string,
  ): Observable<FormOption[]> => {
    return this.store.select(selectInventoryItemsByName(query)).pipe(
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
    const { item } = this.modal.data;
    const { required, minLength, maxLength, min, max } = Validators;

    const controls: any = {
      [FIELD.NAME]: [
        // Value
        item?.name ?? '',
        // Sync validators
        [required, minLength(2), maxLength(100)],
        // Async validators,
        [uniqueItemNameValidator(this.store, this.modal.data?.item?.id ?? null)],
      ],
      [FIELD.AMOUNT]: [item?.amount ?? 1, [required, min(1), max(100)]],
      [FIELD.DESCRIPTION]: [item?.description ?? '', [minLength(2), maxLength(100)]],
      [FIELD.CATEGORY]: [item?.category ?? null, [minLength(2), maxLength(100)]],
    };

    // Add create-only fields
    if (!this.isEditing()) {
      controls[FIELD.ADD_TO_INVENTORY] = [false];
    }

    // Add edit-only fields
    else {
      controls[FIELD.IS_DONE] = [!!item?.isDone];
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
