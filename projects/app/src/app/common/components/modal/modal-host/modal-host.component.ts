import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, ViewContainerRef, ViewEncapsulation, effect, inject, input, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { ButtonComponent } from '../../button';
import { ModalService } from '../modal.service';
import { ModalHostLabels } from '../types';
import { ModalKeyboardController, createModalKeyboardController } from './keyboard.controller';

const imports = [
  NgTemplateOutlet,
  ButtonComponent,
  MatIconModule,
  TranslocoModule,
];

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports,
  templateUrl: './modal-host.component.html',
  styleUrl: './modal-host.component.scss',
  host: { class: 'app-modal-host' },
  encapsulation: ViewEncapsulation.None,
})
export class ModalHostComponent implements OnDestroy {

  private modalService = inject(ModalService);

  labels = input<ModalHostLabels>();

  @HostBinding('class.-open')
  get cssClassOpen() {
    return this.modalService.isOpen();
  }

  @HostBinding('class.-full-page')
  get cssClassFullPage() {
    return this.modalService.isFullPage();
  }

  modalTarget = viewChild.required('modalTarget', { read: ViewContainerRef });
  modalRef = viewChild.required<ElementRef<HTMLElement>>('modalRef');
  headerTemplate = this.modalService.headerTemplate;
  footerTemplate = this.modalService.footerTemplate;
  private keyboardController!: ModalKeyboardController;

  onOpenChange$ = effect(() => {
    if (this.modalService.isOpen()) {
      this.keyboardController.enable();
    } else {
      this.keyboardController.disable();
    }
  }, { allowSignalWrites: true });

  ngOnInit() {
    this.modalService.registerTarget(this.modalTarget());
    const modalElement = this.modalRef().nativeElement;
    this.keyboardController = createModalKeyboardController(modalElement);
    this.keyboardController.canceled$.subscribe(() => this.modalService.cancel());
  }

  ngOnDestroy() {
    this.keyboardController.destroy();
  }

  onDismiss() {
    this.modalService.cancel();
  }

  onConfirm() {
    this.modalService.clickConfirm();
  }
}
