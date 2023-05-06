import { Directive, OnInit, TemplateRef, inject } from '@angular/core';

import { ModalService } from './modal.service';

@Directive({
  selector: '[appModalHeader]',
  standalone: true,
})
export class ModalHeaderDirective implements OnInit {

  template = inject(TemplateRef<void>);
  modalService = inject(ModalService);

  ngOnInit() {
    this.modalService.registerHeaderTemplate(this.template);
  }
}