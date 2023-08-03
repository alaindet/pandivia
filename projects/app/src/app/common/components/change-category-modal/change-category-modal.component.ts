import { Component, ViewEncapsulation } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { BaseModalComponent, ModalFooterDirective, ModalHeaderDirective } from '../modal';
import { ChangeCategoryModalInput, ChangeCategoryModalOutput } from './types';
import { ButtonComponent } from '../button';

const imports = [
  NgFor,
  MatIconModule,
  TranslocoModule,
  ButtonComponent,
  ModalHeaderDirective,
  ModalFooterDirective,
];

@Component({
  selector: 'app-change-category-modal',
  standalone: true,
  imports,
  templateUrl: './change-category-modal.component.html',
  styleUrls: ['./change-category-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-change-category-modal' },
})
export class ChangeCategoryModalComponent extends BaseModalComponent<
  ChangeCategoryModalInput,
  ChangeCategoryModalOutput
> {

  onSelectCategory(category: string) {
    this.modal.confirm({ category });
  }

  onDismiss() {
    this.modal.cancel();
  }
}
