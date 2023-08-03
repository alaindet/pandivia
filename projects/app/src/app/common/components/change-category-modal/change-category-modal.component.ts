import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

import { BaseModalComponent, ModalFooterDirective, ModalHeaderDirective } from '../modal';
import { ChangeCategoryModalInput, ChangeCategoryModalOutput } from './types';

const imports = [
  NgFor,
  ModalHeaderDirective,
  ModalFooterDirective,
];

@Component({
  selector: 'app-change-category-modal',
  standalone: true,
  imports,
  templateUrl: './change-category-modal.component.html',
})
export class ChangeCategoryModalComponent extends BaseModalComponent<
  ChangeCategoryModalInput,
  ChangeCategoryModalOutput
> {

  onSelectCategory(category: string) {
    this.modal.confirm({ category });
  }
}
