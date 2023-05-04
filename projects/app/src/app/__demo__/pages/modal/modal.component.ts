import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';

import { ButtonComponent } from '@app/common/components';
import { ModalService, ModalTemplateInput } from '@app/common/components/modal';

type ModalOneInput = {
  value: string | null;
};

type ModalOneOutput = {
  value: string;
};

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

  @ViewChild('modalOne', { static: true, read: TemplateRef<ModalOneInput> })
  modalOneRef!: TemplateRef<ModalTemplateInput<ModalOneInput>>;

  async onOpenModal() {

    const modal = this.modal.openByTemplate<ModalOneInput, ModalOneOutput>(
      'demo-modal-one',
      this.modalOneRef,
      {
        value: 'Hello World!',
      },
    );

    const result = await modal.closed;
    console.log('modal closed', result);
  }
}
