import { Component } from '@angular/core';
import { matCheck, matClose } from '@ng-icons/material-icons/baseline';

import { ModalHeaderDirective } from '../modal-header.directive';
import { BaseModalComponent } from '../types';
import { ConfirmPromptModalInput, ConfirmPromptModalOutput } from './types';

@Component({
  selector: 'app-confirm-prompt-modal',
  imports: [ModalHeaderDirective],
  templateUrl: './confirm-prompt-modal.component.html',
})
export class ConfirmPromptModalComponent extends BaseModalComponent<
  ConfirmPromptModalInput,
  ConfirmPromptModalOutput
> {
  icon = {
    matCheck,
    matClose,
  };

  i18nCancel = 'Cancel'; // TODO: Translate
  i18nConfirm = 'Confirm'; // TODO: Translate
}
