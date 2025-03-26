import { Component, ViewEncapsulation } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { matClose } from '@ng-icons/material-icons/baseline';
import { TranslocoModule } from '@jsverse/transloco';

import {
  BaseModalComponent,
  ModalFooterDirective,
  ModalHeaderDirective,
} from '../modal';
import { ChangeCategoryModalInput, ChangeCategoryModalOutput } from './types';
import { ButtonComponent } from '../button';

@Component({
  selector: 'app-change-category-modal',
  imports: [
    TranslocoModule,
    NgIcon,
    ButtonComponent,
    ModalHeaderDirective,
    ModalFooterDirective,
  ],
  templateUrl: './change-category-modal.component.html',
  styleUrl: './change-category-modal.component.css',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-change-category-modal' },
})
export class ChangeCategoryModalComponent extends BaseModalComponent<
  ChangeCategoryModalInput,
  ChangeCategoryModalOutput
> {
  matClose = matClose;

  onSelectCategory(category: string) {
    this.modal.confirm({ category });
  }

  onDismiss() {
    this.modal.cancel();
  }
}
