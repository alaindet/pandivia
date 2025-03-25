import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
    TranslocoModule,
    ButtonComponent,
    ModalHeaderDirective,
    ModalFooterDirective,
  ],
  templateUrl: './change-category-modal.component.html',
  styleUrl: './change-category-modal.component.scss',
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
