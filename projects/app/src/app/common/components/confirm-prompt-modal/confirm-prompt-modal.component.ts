import { Component, OnInit } from '@angular/core';

import { BaseModalComponent, ModalFooterDirective, ModalHeaderDirective } from '../modal';
import { ConfirmPromptModalInput, ConfirmPromptModalOutput } from './types';

const imports = [
  ModalHeaderDirective,
  ModalFooterDirective,
];

@Component({
  selector: 'app-confirm-prompt-modal',
  standalone: true,
  imports,
  templateUrl: './confirm-prompt-modal.component.html',
})
export class ConfirmPromptModalComponent extends BaseModalComponent<
  ConfirmPromptModalInput,
  ConfirmPromptModalOutput
> implements OnInit {

  ngOnInit() {
    this.registerOnConfirm(() => {
      const { action } = this.modal.data;
      const outputData: ConfirmPromptModalOutput = { action };
      this.modal.confirm(outputData);
    });
  }
}
