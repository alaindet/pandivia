import { Component, OnInit } from '@angular/core';
import { matCheck, matClose } from '@ng-icons/material-icons/baseline';

import { ModalHeaderDirective } from '../modal-header.directive';
import { BaseModalComponent } from '../types';
import { ConfirmPromptModalInput, ConfirmPromptModalOutput } from './types';

@Component({
  selector: 'app-confirm-prompt-modal',
  imports: [ModalHeaderDirective],
  templateUrl: './confirm-prompt-modal.component.html',
})
export class ConfirmPromptModalComponent
  extends BaseModalComponent<ConfirmPromptModalInput, ConfirmPromptModalOutput>
  implements OnInit
{
  icon = {
    matCheck,
    matClose,
  };

  ngOnInit() {
    this.registerOnConfirm(() => {
      const { action } = this.modal.data;
      this.modal.confirm({ action });
    });
  }
}
