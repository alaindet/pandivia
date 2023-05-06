import { ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '../../button';
import { ModalService } from '../modal.service';
import { createKeyboardFocusTrap } from '@app/common/utils';
import { OnceSource } from '@app/common/sources';

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
export class ModalHostComponent implements OnDestroy {

  private once = new OnceSource();
  private cdr = inject(ChangeDetectorRef);
  modalService = inject(ModalService);

  @HostBinding('class.-open') cssOpen = false;

  @ViewChild('modalTarget', { static: true, read: ViewContainerRef })
  modalTarget!: ViewContainerRef;

  @ViewChild('modalRef', { static: true })
  modalRef!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.modalService.registerTarget(this.modalTarget);
    const element = this.modalRef.nativeElement;
    const focusTrap = createKeyboardFocusTrap(element, this.once.event$);
    this.modalService.open$.subscribe(open => {
      open ? focusTrap.enable() : focusTrap.disable();
      this.cssOpen = open;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.once.trigger();
  }

  onDismiss() {
    this.modalService.cancel();
  }

  onConfirm() {
    this.modalService.clickConfirm();
  }
}
