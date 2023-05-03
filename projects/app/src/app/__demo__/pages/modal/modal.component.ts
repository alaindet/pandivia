import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { ModalService } from '@app/common/components/modal';

type ModalOneInput = {
  value: string | null;
};

const IMPORTS = [
  CommonModule,
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
  modalOneRef!: TemplateRef<ModalOneInput>;

  onOpenModal() {
    
  }
}
