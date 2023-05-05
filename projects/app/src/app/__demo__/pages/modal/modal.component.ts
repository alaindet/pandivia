import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';

import { ButtonComponent } from '@app/common/components';
import { ModalService, ModalTemplateInput } from '@app/common/components/modal';
import { ModalOneComponent } from './modal-one.component';

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
  modalClass?: any;

  @ViewChild('modalOne', { static: true, read: TemplateRef<ModalOneInput> })
  modalOneRef!: TemplateRef<ModalTemplateInput<ModalOneInput>>;

  private async loadModalClass(): Promise<any> {
    if (!this.modalClass) {
      const { ModalOneComponent } = await import('./modal-one.component');
      this.modalClass = ModalOneComponent;
    }
    return this.modalClass;
  }

  async onOpenModal() {
    const modalClass = await this.loadModalClass();
    const data: ModalOneInput = { value: 'Hello World' };
    const ref = this.modal.open(modalClass, data);

    // clear dynamic components shown in the container previously
    this.vcr.clear();
    for (const componentType of componentTypes) {
      const newComponentRef = this.vcr.createComponent(componentType);
      newComponentRef.instance.pokemon = currentPokemon ? currentPokemon : this.pokemon;
      // store component refs created
      this.componentRefs.push(newComponentRef);
      // run change detection in the component and child components
      this.cdr.detectChanges();
    }

    // ModalOneComponent

    // const modal = this.modal.openByTemplate<ModalOneInput, ModalOneOutput>(
    //   'demo-modal-one',
    //   this.modalOneRef,
    //   {
    //     value: 'Hello World!',
    //   },
    // );

    // const result = await modal.closed;
    // console.log('modal closed', result);
  }
}
