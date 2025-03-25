import { Directive, OnInit, TemplateRef, inject } from '@angular/core';

import { ModalService } from './modal.service';

@Directive({
  selector: '[appModalFooter]',
})
export class ModalFooterDirective implements OnInit {
  template = inject(TemplateRef<void>);
  modalService = inject(ModalService);

  ngOnInit() {
    this.modalService.registerFooterTemplate(this.template);
  }
}
