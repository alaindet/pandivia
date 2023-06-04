import { Component, OnInit } from '@angular/core';

import { BaseModalComponent, ModalFooterDirective, ModalHeaderDirective } from '@app/common/components';
import { ConfirmPromptModalInput, ConfirmPromptModalOutput } from './types';

const IMPORTS = [
  ModalHeaderDirective,
  ModalFooterDirective,
];

@Component({
  selector: 'app-list-confirm-prompt-modal',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './confirm-prompt-modal.component.html',
})
export class ConfirmPromptModalComponent extends BaseModalComponent<
  ConfirmPromptModalInput,
  ConfirmPromptModalOutput
> implements OnInit {

  ngOnInit() {
    this.registerOnConfirm(() => {
      const { action, type, value } = this.modal.data;
      const data: ConfirmPromptModalOutput = { action, type, value };
      this.modal.confirm(data);
    });
  }
}
