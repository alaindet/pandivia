import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  ViewContainerRef,
  ViewEncapsulation,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  matClear,
  matClose,
  matCheck,
} from '@ng-icons/material-icons/baseline';
import { TranslocoModule } from '@jsverse/transloco';

import { ButtonComponent } from '../../button';
import { IconButtonComponent } from '../../icon-button';
import { ModalService } from '../modal.service';
import {
  ModalKeyboardController,
  createModalKeyboardController,
} from './keyboard.controller';

@Component({
  selector: 'app-modal-host',
  imports: [
    NgTemplateOutlet,
    ButtonComponent,
    IconButtonComponent,
    NgIcon,
    TranslocoModule,
  ],
  templateUrl: './modal-host.component.html',
  styleUrl: './modal-host.component.css',
  host: { class: 'app-modal-host' },
  encapsulation: ViewEncapsulation.None,
})
export class ModalHostComponent implements OnDestroy {
  private modalService = inject(ModalService);

  i18nConfirm = input('Confirm');
  i18nCancel = input('Cancel');

  icon = {
    matCheck,
    matClear,
    matClose,
  };

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

  openEffect = effect(() => {
    this.modalService.isOpen()
      ? this.keyboardController.enable()
      : this.keyboardController.disable();
  });

  ngOnInit() {
    this.modalService.registerTarget(this.modalTarget());
    const modalElement = this.modalRef().nativeElement;
    this.keyboardController = createModalKeyboardController(modalElement);
    this.keyboardController.canceled$.subscribe(() =>
      this.modalService.cancel()
    );
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
