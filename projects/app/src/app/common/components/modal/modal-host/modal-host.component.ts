import { ChangeDetectorRef, Component, ElementRef, HostBinding, ViewChild, ViewContainerRef, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '../../button';
import { ModalService } from '../modal.service';
import { createFocusTrap } from '@app/common/utils';

const IMPORTS = [
  CommonModule,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './modal-host.component.html',
  styleUrls: ['./modal-host.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-modal-host' },
})
export class ModalHostComponent {

  private cdr = inject(ChangeDetectorRef);
  modalService = inject(ModalService);

  @HostBinding('class.-open') cssOpen = false;

  @ViewChild('modalTarget', { static: true, read: ViewContainerRef })
  modalTarget!: ViewContainerRef;

  @ViewChild('modalRef', { static: true })
  modalRef!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.modalService.registerTarget(this.modalTarget);
    const focusTrap = createFocusTrap(this.modalRef.nativeElement);
    this.modalService.open$.subscribe(open => {
      open ? focusTrap.enable() : focusTrap.disable();
      this.cssOpen = open;
      this.cdr.detectChanges();
    });
  }

  onDismiss() {
    this.modalService.cancel();
  }

  onConfirm() {
    this.modalService.clickConfirm();
  }
}
