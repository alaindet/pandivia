import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { BaseModalComponent, ButtonComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent, TextareaComponent, ToggleComponent } from '@app/common/components';
import { FormOption } from '@app/common/types';
import { ITEM_FORM_FIELD as FIELD, ItemFormModalInput, ItemFormModalOutput } from './types';

const IMPORTS = [
  MatIconModule,
  NgIf,
  ReactiveFormsModule,
  ModalHeaderDirective,
  ModalFooterDirective,
  ...FORM_FIELD_EXPORTS,
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
