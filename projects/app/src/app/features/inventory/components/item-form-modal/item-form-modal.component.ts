import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon } from '@ng-icons/core';
import {
  matClear,
  matSync,
  matEdit,
  matPlaylistAdd,
  matAdd,
} from '@ng-icons/material-icons/baseline';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormOption } from '@common/types';
import { getFieldDescriptor as fDescribe } from '@common/utils';
import { MediaQueryService } from '@fruit/services';
import { ButtonComponent } from '@fruit/components/button';
import {
  BaseModalComponent,
  ModalFooterDirective,
  ModalHeaderDirective,
} from '@ui/components/modal';
import { TextInputComponent } from '@fruit/components/text-input';
import { TextareaComponent } from '@fruit/components/textarea';
import { FORM_FIELD_EXPORTS } from '@ui/components/form-field';
import {
  AUTOCOMPLETE_EXPORTS,
  AutocompleteAsyncOptionsFn,
  AutocompleteOption,
} from '@ui/components/autocomplete';

import {
  FieldErrorPipe,
  FieldErrorIdPipe,
  FieldStatusPipe,
} from '@fruit/pipes';
import { DEFAULT_CATEGORY } from '@app/core/constants';
import { InventoryStore } from '../../store';
import { CreateInventoryItemDto, InventoryItem } from '../../types';
import { uniqueInventoryItemNameValidator } from '../../validators';
import { INVENTORY_ITEM_FORM_FIELD as FIELD } from './fields';
import {
  CreateInventoryItemFormModalOutput,
  EditInventoryItemFormModalOutput,
  InventoryItemFormModalInput,
  InventoryItemFormModalOutput,
} from './types';

@Component({
  selector: 'app-inventory-item-form-modal',
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    NgIcon,
    ModalHeaderDirective,
    ModalFooterDirective,
    TextInputComponent,
    TextareaComponent,
    ButtonComponent,
    FieldErrorPipe,
    FieldErrorIdPipe,
    FieldStatusPipe,
    ...FORM_FIELD_EXPORTS,
    ...AUTOCOMPLETE_EXPORTS,
  ],
  templateUrl: './item-form-modal.component.html',
  styleUrl: './item-form-modal.component.css',
})
export class InventoryItemFormModalComponent
  extends BaseModalComponent<
    InventoryItemFormModalInput,
    InventoryItemFormModalOutput
  >
  implements OnInit
{
  private inventoryStore = inject(InventoryStore);
  private formBuilder = inject(FormBuilder);
  isMobile = inject(MediaQueryService).getFromMobileDown();

  FIELD = FIELD;
  theForm!: FormGroup;
  isEditing = signal(false);
  isSaving = this.inventoryStore.isLoading;
  shouldContinue = false;

  matClear = matClear;
  matSync = matSync;
  matEdit = matEdit;
  matPlaylistAdd = matPlaylistAdd;
  matAdd = matAdd;

  get fName() {
    return fDescribe(this.theForm, FIELD.NAME.id);
  }
  get fDesc() {
    return fDescribe(this.theForm, FIELD.DESCRIPTION.id);
  }
  get fCategory() {
    return fDescribe(this.theForm, FIELD.CATEGORY.id);
  }

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
    query: string
  ): Observable<FormOption[]> => {
    return this.inventoryStore.filterCategoryOptions(query);
  };

  onCancel() {
    this.modal.cancel();
  }

  onSubmit() {
    if (this.theForm.invalid) {
      this.theForm.markAllAsTouched();
      return;
    }

    this.isEditing() ? this.onEdit() : this.onCreate();
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
    this.inventoryStore.item.edit(item);
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
    this.inventoryStore.item.create(item);
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
        [
          uniqueInventoryItemNameValidator(
            this.inventoryStore,
            this.modal.data?.item?.id ?? null
          ),
        ],
      ],
      [FIELD.DESCRIPTION.id]: [
        item?.description ?? '',
        [minLength(2), maxLength(100)],
      ],
      [FIELD.CATEGORY.id]: [fieldCategory, [minLength(2), maxLength(100)]],
    };

    this.theForm = this.formBuilder.group(controls);
  }

  private afterCreateOrEditSuccess(fn: () => void): void {
    const stop$ = new Subject<void>();
    let first = true;

    this.inventoryStore.itemModalSuccessCounter$
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
