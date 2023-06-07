import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { BaseModalComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent } from '@app/common/components';
import { ItemFormModalInput, ItemFormModalOutput, ITEM_FORM_FIELD as FIELD } from './types';
import { FormOption } from '@app/common/types';

const IMPORTS = [
  JsonPipe, // TODO: Remove
  MatIconModule,
  NgIf,
  ReactiveFormsModule,
  ModalHeaderDirective,
  ModalFooterDirective,
  ...FORM_FIELD_EXPORTS,
  TextInputComponent,
  QuickNumberComponent,
  SelectComponent,
];

@Component({
  selector: 'app-list-item-form-modal',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './item-form-modal.component.html',
})
export class ItemFormModalComponent extends BaseModalComponent<
  ItemFormModalInput,
  ItemFormModalOutput
> implements OnInit {

  private formBuilder = inject(FormBuilder);

  FIELD = FIELD;
  theForm!: FormGroup;

  // TODO
  categoryOptions: FormOption[] = [];

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
    // TODO: Use modal API
    this.initForm();
  }

  onCancel() {
    // TODO
    console.log('onCancel');
  }

  onEdit() {
    // TODO
    console.log('onEdit');
  }

  onCreate() {
    // TODO
    console.log('onCreate');
  }


  private initForm(): void {
    const { item } = this.modal.data;
    const { required, minLength, maxLength, min, max } = Validators;

    this.theForm = this.formBuilder.group({
      [FIELD.NAME]: [item?.name ?? '', [required, minLength(2), maxLength(100)]],
      [FIELD.AMOUNT]: [item?.amount ?? 1, [required, min(1), max(100)]],
      [FIELD.DESCRIPTION]: [item?.description ?? '', [minLength(2), maxLength(200)]],
      [FIELD.CATEGORY]: [item?.category ?? null, [minLength(2), maxLength(100)]],
      [FIELD.IS_DONE]: [!!item?.isDone],
    });
  }
}
