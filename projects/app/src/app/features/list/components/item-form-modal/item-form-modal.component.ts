import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormOption } from '@common/types';
import { getFieldDescriptor as fDescribe } from '@common/utils';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon } from '@ng-icons/core';
import {
  matAdd,
  matClear,
  matEdit,
  matPlaylistAdd,
  matSync,
} from '@ng-icons/material-icons/baseline';
import {
  AutocompleteAsyncOptionsFn,
  AutocompleteComponent,
  AutocompleteOption,
  AutocompleteOptionDirective,
  BaseModalComponent,
  ButtonComponent,
  CheckboxComponent,
  FormFieldComponent,
  FormFieldErrorComponent,
  FormFieldHintComponent,
  FormFieldLabelComponent,
  ModalFooterDirective,
  ModalHeaderDirective,
  QuickNumberComponent,
  TextInputComponent,
  TextareaComponent,
  ToggleComponent,
} from '@ui/components';
import { FieldErrorIdPipe, FieldErrorPipe, FieldStatusPipe } from '@ui/pipes';
import { MediaQueryService } from '@ui/services';
import { Observable, Subject, takeUntil } from 'rxjs';

import { DEFAULT_CATEGORY } from '@app/core/constants';
import { UiStore } from '@app/core/ui';
import { InventoryStore } from '@app/features/inventory/store';
import { ListStore } from '../../store';
import { ListItem } from '../../types';
import { uniqueListItemNameValidator } from '../../validators';
import { LIST_ITEM_FORM_FIELD as FIELD } from './fields';
import {
  CreateListItemFormModalOutput,
  EditListItemFormModalOutput,
  ListItemFormModalInput,
  ListItemFormModalOutput,
} from './types';

@Component({
  selector: 'app-list-item-form-modal',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    TranslocoModule,
    ModalHeaderDirective,
    ModalFooterDirective,
    TextInputComponent,
    QuickNumberComponent,
    ButtonComponent,
    TextareaComponent,
    FieldErrorPipe,
    FieldErrorIdPipe,
    FieldStatusPipe,
    FormFieldComponent,
    FormFieldErrorComponent,
    FormFieldHintComponent,
    FormFieldLabelComponent,
    AutocompleteComponent,
    AutocompleteOptionDirective,
    CheckboxComponent,
  ],
  templateUrl: './item-form-modal.component.html',
  styleUrl: './item-form-modal.component.css',
})
export class ListItemFormModalComponent
  extends BaseModalComponent<ListItemFormModalInput, ListItemFormModalOutput>
  implements OnInit
{
  private formBuilder = inject(FormBuilder);
  private uiStore = inject(UiStore);
  private listStore = inject(ListStore);
  private inventoryStore = inject(InventoryStore);
  isMobile = inject(MediaQueryService).getFromMobileDown();

  nameRef = viewChild.required('nameRef', { read: TextInputComponent });

  isEditing = signal(false);
  FIELD = FIELD;
  theForm!: FormGroup;
  isSaving = this.uiStore.loader.loading;
  shouldContinue = false;
  themeConfig = this.uiStore.theme.config;
  icon = {
    matClear,
    matAdd,
    matSync,
    matEdit,
    matPlaylistAdd,
  };

  get fName() {
    return fDescribe(this.theForm, FIELD.NAME.id);
  }

  get fAmount() {
    return fDescribe(this.theForm, FIELD.AMOUNT.id);
  }

  get fDesc() {
    return fDescribe(this.theForm, FIELD.DESCRIPTION.id);
  }

  get fCategory() {
    return fDescribe(this.theForm, FIELD.CATEGORY.id);
  }

  get fDone() {
    return fDescribe(this.theForm, FIELD.IS_DONE.id);
  }

  ngOnInit() {
    this.inventoryStore.allItems.fetch({
      force: false,
      withNotifications: false,
    });
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

    this.isEditing() ? this.onEdit() : this.onCreate();
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
    this.listStore.item.edit(item);
  }

  private onCreate() {
    let { [FIELD.ADD_TO_INVENTORY.id]: addToInventory, ...item } =
      this.theForm.value;

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
        this.nameRef()?.focus();
        return;
      }

      // Otherwise close the modal
      const data: CreateListItemFormModalOutput = { item, addToInventory };
      this.modal.confirm(data);
    });

    // Try to create
    this.listStore.item.create(item);

    // Try to clone this item to the Inventory
    if (addToInventory) {
      const { amount, ...dto } = item;
      this.inventoryStore.item.cloneFromListItem(dto);
    }
  }

  nameFieldOptions: AutocompleteAsyncOptionsFn = (
    query: string
  ): Observable<FormOption[]> => {
    return this.listStore.filterItemNameOptions(query);
  };

  categoryFieldOptions: AutocompleteAsyncOptionsFn = (
    query: string
  ): Observable<FormOption[]> => {
    return this.listStore.filterCategoryOptions(query);
  };

  private initForm(): void {
    const { item, category, name } = this.modal.data;
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
        item?.name ?? name ?? '',

        // Sync validators
        [required, minLength(1), maxLength(100)],

        // Async validators,
        [
          uniqueListItemNameValidator(
            this.listStore,
            this.modal.data?.item?.id ?? null
          ),
        ],
      ],
      [FIELD.AMOUNT.id]: [item?.amount ?? 1, [required, min(1), max(100)]],
      [FIELD.DESCRIPTION.id]: [
        item?.description ?? '',
        [minLength(2), maxLength(100)],
      ],
      [FIELD.CATEGORY.id]: [fieldCategory, [minLength(2), maxLength(100)]],
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

    this.listStore.itemModalSuccessCounter$
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
