import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ButtonComponent } from '@app/common/components';
import { ModalService } from '@app/common/components/modal';
import { ModalOneInput, ModalOneOutput, ModalOneComponent } from './modal-one.component';

const IMPORTS = [
  CommonModule,
  ButtonComponent,
];

@Component({
  selector: 'app-demo-modal',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './modal.component.html',
})
export class ModalDemoPageComponent {

  modal = inject(ModalService);

  async onOpenModal() {

    const data: ModalOneInput = {
      value: 'Hello World!',
    };

    const ref = this.modal.open<ModalOneInput, ModalOneOutput>(
      ModalOneComponent,
      data,
    );

    ref.closed().subscribe(output => this.onCloseModal(output));
  }

  onCloseModal(data?: ModalOneOutput) {
    console.log('onCloseModal', data);
  }
}
