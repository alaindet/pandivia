import { Component, OnInit } from '@angular/core';

import { ConfirmPromptModalInput, ConfirmPromptModalOutput } from './types';
import { ModalHeaderDirective } from '../modal-header.directive';
import { BaseModalComponent } from '../types';

@Component({
  selector: 'app-confirm-prompt-modal',
  imports: [ModalHeaderDirective],
  templateUrl: './confirm-prompt-modal.component.html',
})
export class ConfirmPromptModalComponent
  extends BaseModalComponent<ConfirmPromptModalInput, ConfirmPromptModalOutput>
  implements OnInit
{
  ngOnInit() {
    this.registerOnConfirm(() => {
      const { action } = this.modal.data;
      const outputData: ConfirmPromptModalOutput = { action };
      this.modal.confirm(outputData);
    });
  }
}
