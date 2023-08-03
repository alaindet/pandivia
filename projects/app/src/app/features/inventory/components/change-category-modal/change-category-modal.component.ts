import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AUTOCOMPLETE_EXPORTS, BaseModalComponent, ButtonComponent, FORM_FIELD_EXPORTS, ModalFooterDirective, ModalHeaderDirective, QuickNumberComponent, SelectComponent, TextInputComponent, TextareaComponent, ToggleComponent } from '@app/common/components';
import { FIELD_PIPES_EXPORTS } from '@app/common/pipes';
import { InventoryChangeCategoryModalInput,InventoryChangeCategoryModalOutput } from './types';

const imports = [
  NgIf,
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
  selector: 'app-inventory-change-category-modal',
  standalone: true,
  imports,
  templateUrl: './change-category-modal.component.html',
  styleUrls: ['./change-category-modal.component.scss'],
})
export class InventoryChangeCategoryModalComponent extends BaseModalComponent<
  InventoryItemFormModalInput,
  InventoryItemFormModalOutput
> implements OnInit {

  private store = inject(Store);
  private formBuilder = inject(FormBuilder);

  ngOnInit() {
    // ...
  }
}
