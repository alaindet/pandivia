import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@ui/components';
import { ModalService } from '@ui/components';

import { ModalOneComponent, ModalOneInput, ModalOneOutput } from './modal-one';

@Component({
  selector: 'app-demo-modal',
  imports: [ButtonComponent],
  templateUrl: './modal.component.html',
})
export class ModalDemoPageComponent {
  modal = inject(ModalService);

  onOpenModal() {
    this.openModal(false);
  }

  onOpenFullPageModal() {
    this.openModal(true);
  }

  onCloseModal(data?: ModalOneOutput) {
    console.log('onCloseModal', data);
  }

  private async openModal(fullPage = false) {
    const data: ModalOneInput = {
      value: 'Hello World!',
    };

    const ref = this.modal.open<ModalOneInput, ModalOneOutput>(
      ModalOneComponent,
      data,
      { fullPage }
    );

    ref.canceled().subscribe(() => console.log('canceled'));
    ref.confirmed().subscribe((data) => console.log('confirmed', data));
    ref.closed().subscribe((output) => console.log('closed', output));
  }
}
