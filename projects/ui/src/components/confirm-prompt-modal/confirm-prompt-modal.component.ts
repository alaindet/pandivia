import { Component, OnInit } from '@angular/core';

import { BaseModalComponent, ModalHeaderDirective } from '@ui/components/modal';
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
  ngOnInit() {
    this.registerOnConfirm(() => {
      const { action } = this.modal.data;
      const outputData: ConfirmPromptModalOutput = { action };
      this.modal.confirm(outputData);
    });
  }
}
